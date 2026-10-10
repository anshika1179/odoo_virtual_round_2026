"""
Traveloop PDF Invoice Service
Generates professional, styled PDF invoices using ReportLab.
"""

import io
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer,
    HRFlowable, Frame, PageTemplate, BaseDocTemplate
)
from reportlab.graphics.shapes import Drawing, Rect, String, Circle, Line
from reportlab.graphics import renderPDF

# A Unicode TTF is needed for currency glyphs like the rupee sign (Helvetica
# has no glyph for them). Use the first font found on the system; if none is
# available, amounts fall back to the currency code (e.g. "INR") as prefix.
import os as _os
from reportlab.pdfbase import pdfmetrics as _pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont as _TTFont

_UNICODE_FONT = None
for _font_path in (
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    "C:/Windows/Fonts/arial.ttf",
    "C:/Windows/Fonts/segoeui.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
):
    if _os.path.exists(_font_path):
        try:
            _pdfmetrics.registerFont(_TTFont("UnicodeSans", _font_path))
            _UNICODE_FONT = "UnicodeSans"
            break
        except Exception:
            continue


# ── Brand Colours (black & white invoice) ───────────────────────────
BRAND_INDIGO = colors.black
BRAND_PURPLE = colors.black
BRAND_DARK = colors.black
BRAND_CARD = colors.black
BRAND_SURFACE = colors.black
BRAND_TEXT = colors.black
BRAND_MUTED = colors.HexColor("#555555")
BRAND_GREEN = colors.black
BRAND_RED = colors.black
BRAND_AMBER = colors.black
WHITE = colors.white

# ── Display currency (mirrors the frontend rule: amounts stored in USD,
# shown in the user's country currency; rates are fixed approximations) ──
_CURRENCIES = {
    "india": ("INR", "\u20b9", 83, "en-IN"),
    "united states": ("USD", "$", 1, "en-US"), "usa": ("USD", "$", 1, "en-US"),
    "united kingdom": ("GBP", "\u00a3", 0.79, "en-GB"), "uk": ("GBP", "\u00a3", 0.79, "en-GB"),
    "france": ("EUR", "\u20ac", 0.92, "fr-FR"), "germany": ("EUR", "\u20ac", 0.92, "de-DE"),
    "italy": ("EUR", "\u20ac", 0.92, "it-IT"), "spain": ("EUR", "\u20ac", 0.92, "es-ES"),
    "netherlands": ("EUR", "\u20ac", 0.92, "nl-NL"), "portugal": ("EUR", "\u20ac", 0.92, "pt-PT"),
    "ireland": ("EUR", "\u20ac", 0.92, "en-IE"),
    "japan": ("JPY", "\u00a5", 150, "ja-JP"), "china": ("CNY", "\u00a5", 7.2, "zh-CN"),
    "australia": ("AUD", "A$", 1.5, "en-AU"), "canada": ("CAD", "C$", 1.37, "en-CA"),
    "singapore": ("SGD", "S$", 1.35, "en-SG"),
    "united arab emirates": ("AED", "AED ", 3.67, "en-AE"), "uae": ("AED", "AED ", 3.67, "en-AE"),
    "thailand": ("THB", "\u0e3f", 36, "th-TH"), "indonesia": ("IDR", "Rp ", 15800, "id-ID"),
    "malaysia": ("MYR", "RM ", 4.7, "ms-MY"), "south korea": ("KRW", "\u20a9", 1350, "ko-KR"),
    "switzerland": ("CHF", "CHF ", 0.88, "de-CH"), "new zealand": ("NZD", "NZ$", 1.65, "en-NZ"),
    "sri lanka": ("LKR", "Rs ", 300, "si-LK"), "nepal": ("NPR", "Rs ", 133, "ne-NP"),
    "pakistan": ("PKR", "Rs ", 280, "en-PK"), "bangladesh": ("BDT", "\u09f3", 110, "bn-BD"),
    "south africa": ("ZAR", "R ", 18.5, "en-ZA"), "brazil": ("BRL", "R$", 5.2, "pt-BR"),
    "mexico": ("MXN", "MX$", 18, "es-MX"), "turkey": ("TRY", "\u20ba", 33, "tr-TR"),
    "russia": ("RUB", "\u20bd", 92, "ru-RU"), "egypt": ("EGP", "E\u00a3", 48, "ar-EG"),
    "saudi arabia": ("SAR", "SAR ", 3.75, "en-SA"),
}


def _currency_for(country):
    return _CURRENCIES.get((country or "").strip().lower(), ("USD", "$", 1, "en-US"))


def _indian_group(intpart):
    if len(intpart) <= 3:
        return intpart
    last3 = intpart[-3:]
    rest = intpart[:-3]
    groups = []
    while len(rest) > 2:
        groups.insert(0, rest[-2:])
        rest = rest[:-2]
    if rest:
        groups.insert(0, rest)
    return ",".join(groups + [last3])


def _make_money(country):
    code, symbol, rate, locale = _currency_for(country)
    if not symbol.isascii():
        if _UNICODE_FONT:
            symbol = f'<font name="{_UNICODE_FONT}">{symbol}</font>'
        else:
            symbol = code + " "

    def fmt(usd, digits=None):
        n = (float(usd) or 0) * rate
        d = digits if digits is not None else (0 if rate >= 100 else (0 if float(n).is_integer() else 2))
        s = f"{n:,.{d}f}"
        if locale == "en-IN":
            intpart, _, frac = s.partition(".")
            s = _indian_group(intpart.replace(",", "")) + (("." + frac) if d > 0 else "")
        return symbol + s

    return code, fmt


def _create_styles():
    """Build custom paragraph styles for the invoice."""
    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(
        'InvoiceTitle', parent=styles['Title'],
        fontSize=28, leading=34, textColor=BRAND_INDIGO,
        fontName='Helvetica-Bold', spaceAfter=4,
    ))
    styles.add(ParagraphStyle(
        'InvoiceSubtitle', parent=styles['Normal'],
        fontSize=11, leading=14, textColor=BRAND_MUTED,
        fontName='Helvetica',
    ))
    styles.add(ParagraphStyle(
        'SectionHeader', parent=styles['Heading2'],
        fontSize=14, leading=18, textColor=BRAND_INDIGO,
        fontName='Helvetica-Bold', spaceBefore=16, spaceAfter=8,
    ))
    styles.add(ParagraphStyle(
        'InfoLabel', parent=styles['Normal'],
        fontSize=9, leading=12, textColor=BRAND_MUTED,
        fontName='Helvetica',
    ))
    styles.add(ParagraphStyle(
        'InfoValue', parent=styles['Normal'],
        fontSize=11, leading=14, textColor=BRAND_DARK,
        fontName='Helvetica-Bold',
    ))
    styles.add(ParagraphStyle(
        'Footer', parent=styles['Normal'],
        fontSize=8, leading=10, textColor=BRAND_MUTED,
        fontName='Helvetica', alignment=TA_CENTER,
    ))
    styles.add(ParagraphStyle(
        'TableHeader', parent=styles['Normal'],
        fontSize=9, leading=12, textColor=WHITE,
        fontName='Helvetica-Bold',
    ))
    styles.add(ParagraphStyle(
        'TableCell', parent=styles['Normal'],
        fontSize=9, leading=12, textColor=BRAND_DARK,
        fontName='Helvetica',
    ))
    styles.add(ParagraphStyle(
        'TableCellRight', parent=styles['Normal'],
        fontSize=9, leading=12, textColor=BRAND_DARK,
        fontName='Helvetica', alignment=TA_RIGHT,
    ))
    styles.add(ParagraphStyle(
        'TotalLabel', parent=styles['Normal'],
        fontSize=11, leading=14, textColor=BRAND_DARK,
        fontName='Helvetica-Bold', alignment=TA_RIGHT,
    ))
    styles.add(ParagraphStyle(
        'TotalValue', parent=styles['Normal'],
        fontSize=13, leading=16, textColor=BRAND_INDIGO,
        fontName='Helvetica-Bold', alignment=TA_RIGHT,
    ))
    return styles


def _draw_header_bar(canvas, doc):
    """Draw a gradient-like header stripe on every page."""
    w, h = A4
    # Top bar
    canvas.setFillColor(BRAND_INDIGO)
    canvas.rect(0, h - 8 * mm, w, 8 * mm, fill=1, stroke=0)
    # Thin accent line
    canvas.setFillColor(BRAND_PURPLE)
    canvas.rect(0, h - 10 * mm, w, 2 * mm, fill=1, stroke=0)
    # Bottom footer line
    canvas.setFillColor(BRAND_SURFACE)
    canvas.rect(0, 0, w, 3 * mm, fill=1, stroke=0)


def generate_invoice_pdf(trip, expenses, budget_summary, category_breakdown, user_name: str, user_country: str = "") -> bytes:
    """
    Generate a professional PDF invoice and return raw bytes.

    Args:
        trip: dict with id, title, start_date, end_date
        expenses: list of dicts with category, description, quantity, unit_cost, total_amount
        budget_summary: dict with total_budget, total_spent, remaining
        category_breakdown: dict mapping category → total amount
        user_name: name of the trip owner

    Returns:
        PDF file content as bytes
    """
    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf, pagesize=A4,
        leftMargin=20 * mm, rightMargin=20 * mm,
        topMargin=18 * mm, bottomMargin=15 * mm,
    )
    styles = _create_styles()
    story = []
    currency_code, money = _make_money(user_country)

    # ── LOGO / TITLE BLOCK ────────────────────────────────────────
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("TRAVELOOP", styles['InvoiceTitle']))
    story.append(Paragraph("Travel Expense Invoice", styles['InvoiceSubtitle']))
    story.append(Spacer(1, 2 * mm))

    # Thin divider
    story.append(HRFlowable(
        width="100%", thickness=1, color=BRAND_INDIGO,
        spaceBefore=2, spaceAfter=8,
    ))

    # ── TRIP INFO + INVOICE META ──────────────────────────────────
    start_str = trip.get("start_date", "")[:10]
    end_str = trip.get("end_date", "")[:10]
    invoice_no = f"INV-{trip.get('id', 0):04d}-{datetime.now().strftime('%Y%m%d')}"
    invoice_date = datetime.now().strftime("%B %d, %Y")

    info_data = [
        [
            Paragraph("TRIP DETAILS", styles['InfoLabel']),
            "",
            Paragraph("INVOICE INFO", styles['InfoLabel']),
        ],
        [
            Paragraph(f"<b>{trip.get('title', 'Untitled Trip')}</b>", styles['InfoValue']),
            "",
            Paragraph(f"Invoice #: <b>{invoice_no}</b>", styles['TableCell']),
        ],
        [
            Paragraph(f"Traveler: {user_name}", styles['TableCell']),
            "",
            Paragraph(f"Date: {invoice_date}", styles['TableCell']),
        ],
        [
            Paragraph(f"Dates: {start_str}  →  {end_str}", styles['TableCell']),
            "",
            Paragraph(f"Currency: {currency_code}", styles['TableCell']),
        ],
    ]
    info_table = Table(info_data, colWidths=[85 * mm, 10 * mm, 75 * mm])
    info_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 6 * mm))

    # ── BUDGET SUMMARY CARDS ──────────────────────────────────────
    story.append(Paragraph("Budget Summary", styles['SectionHeader']))

    total_budget = budget_summary.get("total_budget", 0) or 0
    total_spent = budget_summary.get("total_spent", 0) or 0
    remaining = budget_summary.get("remaining", 0) or 0
    is_over = remaining < 0

    budget_data = [[
        Paragraph("Total Budget", styles['InfoLabel']),
        Paragraph("Total Spent", styles['InfoLabel']),
        Paragraph("Remaining", styles['InfoLabel']),
        Paragraph("Status", styles['InfoLabel']),
    ], [
        Paragraph(f"<b>{money(total_budget)}</b>", styles['InfoValue']),
        Paragraph(f"<b>{money(total_spent)}</b>", styles['InfoValue']),
        Paragraph(f"<b>{money(remaining)}</b>", styles['InfoValue']),
        Paragraph(
            f"<b>{'OVER BUDGET' if is_over else 'WITHIN BUDGET'}</b>",
            ParagraphStyle('StatusVal', parent=styles['InfoValue'],
                           textColor=BRAND_RED if is_over else BRAND_GREEN)
        ),
    ]]
    budget_table = Table(budget_data, colWidths=[42.5 * mm] * 4)
    budget_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f5f5f5")),
        ('BOX', (0, 0), (-1, -1), 0.5, BRAND_SURFACE),
        ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.HexColor("#d4d4d4")),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(budget_table)
    story.append(Spacer(1, 6 * mm))

    # ── EXPENSE LINE ITEMS ────────────────────────────────────────
    story.append(Paragraph("Expense Line Items", styles['SectionHeader']))

    # Header row
    header_row = [
        Paragraph("#", styles['TableHeader']),
        Paragraph("Category", styles['TableHeader']),
        Paragraph("Description", styles['TableHeader']),
        Paragraph("Qty", styles['TableHeader']),
        Paragraph("Unit Cost", styles['TableHeader']),
        Paragraph("Amount", styles['TableHeader']),
    ]

    table_data = [header_row]
    for idx, exp in enumerate(expenses, 1):
        table_data.append([
            Paragraph(str(idx), styles['TableCell']),
            Paragraph(str(exp.get("category", "")), styles['TableCell']),
            Paragraph(str(exp.get("description", "")), styles['TableCell']),
            Paragraph(str(exp.get("quantity", 1)), styles['TableCell']),
            Paragraph(f"{money(exp.get('unit_cost', 0), 2)}", styles['TableCellRight']),
            Paragraph(f"{money(exp.get('total_amount', 0), 2)}", styles['TableCellRight']),
        ])

    if not expenses:
        table_data.append([
            Paragraph("—", styles['TableCell']),
            Paragraph("No expenses recorded", styles['TableCell']),
            "", "", "", "",
        ])

    # Totals row
    table_data.append([
        "", "", "", "",
        Paragraph("TOTAL", styles['TotalLabel']),
        Paragraph(f"{money(total_spent)}", styles['TotalValue']),
    ])

    col_widths = [10 * mm, 25 * mm, 62 * mm, 15 * mm, 25 * mm, 30 * mm]
    expense_table = Table(table_data, colWidths=col_widths, repeatRows=1)
    expense_table.setStyle(TableStyle([
        # Header styling
        ('BACKGROUND', (0, 0), (-1, 0), BRAND_INDIGO),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        # Body
        ('BACKGROUND', (0, 1), (-1, -2), WHITE),
        ('ROWBACKGROUNDS', (0, 1), (-1, -2), [WHITE, colors.HexColor("#f5f5f5")]),
        ('TEXTCOLOR', (0, 1), (-1, -1), BRAND_DARK),
        # Totals row
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor("#eeeeee")),
        ('LINEABOVE', (0, -1), (-1, -1), 1.5, BRAND_INDIGO),
        # Grid
        ('BOX', (0, 0), (-1, -1), 0.5, BRAND_SURFACE),
        ('INNERGRID', (0, 0), (-1, -2), 0.25, colors.HexColor("#d4d4d4")),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('ALIGN', (3, 0), (3, -1), 'CENTER'),
        ('ALIGN', (4, 0), (5, -1), 'RIGHT'),
    ]))
    story.append(expense_table)
    story.append(Spacer(1, 8 * mm))

    # ── CATEGORY BREAKDOWN ────────────────────────────────────────
    if category_breakdown:
        story.append(Paragraph("Category Breakdown", styles['SectionHeader']))

        cat_header = [
            Paragraph("Category", styles['TableHeader']),
            Paragraph("Total Spent", styles['TableHeader']),
            Paragraph("% of Total", styles['TableHeader']),
        ]
        cat_data = [cat_header]
        sorted_cats = sorted(category_breakdown.items(), key=lambda x: x[1], reverse=True)
        for cat, amount in sorted_cats:
            pct = (amount / total_spent * 100) if total_spent > 0 else 0
            cat_data.append([
                Paragraph(str(cat), styles['TableCell']),
                Paragraph(f"{money(amount, 2)}", styles['TableCellRight']),
                Paragraph(f"{pct:.1f}%", styles['TableCellRight']),
            ])

        cat_table = Table(cat_data, colWidths=[60 * mm, 50 * mm, 57 * mm])
        cat_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), BRAND_PURPLE),
            ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, colors.HexColor("#f5f5f5")]),
            ('BOX', (0, 0), (-1, -1), 0.5, BRAND_SURFACE),
            ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.HexColor("#d4d4d4")),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('ALIGN', (1, 0), (2, -1), 'RIGHT'),
        ]))
        story.append(cat_table)
        story.append(Spacer(1, 8 * mm))

    # ── FOOTER / NOTES ────────────────────────────────────────────
    story.append(HRFlowable(
        width="100%", thickness=0.5, color=BRAND_SURFACE,
        spaceBefore=4, spaceAfter=6,
    ))
    story.append(Paragraph(
        f"Generated by <b>Traveloop</b> on {invoice_date}  •  "
        f"Invoice #{invoice_no}  •  All amounts in {currency_code}",
        styles['Footer'],
    ))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "This invoice is auto-generated for personal travel expense tracking purposes. "
        "Thank you for using Traveloop — Plan, Explore & Travel Together.",
        styles['Footer'],
    ))

    # ── BUILD ─────────────────────────────────────────────────────
    doc.build(story, onFirstPage=_draw_header_bar, onLaterPages=_draw_header_bar)
    buf.seek(0)
    return buf.getvalue()

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


# ── Brand Colours ────────────────────────────────────────────────────
BRAND_INDIGO = colors.HexColor("#6366f1")
BRAND_PURPLE = colors.HexColor("#7c3aed")
BRAND_DARK = colors.HexColor("#0f172a")
BRAND_CARD = colors.HexColor("#1e293b")
BRAND_SURFACE = colors.HexColor("#334155")
BRAND_TEXT = colors.HexColor("#e2e8f0")
BRAND_MUTED = colors.HexColor("#94a3b8")
BRAND_GREEN = colors.HexColor("#10b981")
BRAND_RED = colors.HexColor("#ef4444")
BRAND_AMBER = colors.HexColor("#f59e0b")
WHITE = colors.white


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


def generate_invoice_pdf(trip, expenses, budget_summary, category_breakdown, user_name: str) -> bytes:
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
            Paragraph(f"Currency: USD", styles['TableCell']),
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
        Paragraph(f"<b>${total_budget:,.2f}</b>", styles['InfoValue']),
        Paragraph(f"<b>${total_spent:,.2f}</b>", styles['InfoValue']),
        Paragraph(f"<b>${remaining:,.2f}</b>", styles['InfoValue']),
        Paragraph(
            f"<b>{'OVER BUDGET' if is_over else 'WITHIN BUDGET'}</b>",
            ParagraphStyle('StatusVal', parent=styles['InfoValue'],
                           textColor=BRAND_RED if is_over else BRAND_GREEN)
        ),
    ]]
    budget_table = Table(budget_data, colWidths=[42.5 * mm] * 4)
    budget_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
        ('BOX', (0, 0), (-1, -1), 0.5, BRAND_SURFACE),
        ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.HexColor("#e2e8f0")),
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
            Paragraph(f"${exp.get('unit_cost', 0):,.2f}", styles['TableCellRight']),
            Paragraph(f"${exp.get('total_amount', 0):,.2f}", styles['TableCellRight']),
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
        Paragraph(f"${total_spent:,.2f}", styles['TotalValue']),
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
        ('ROWBACKGROUNDS', (0, 1), (-1, -2), [WHITE, colors.HexColor("#f8fafc")]),
        ('TEXTCOLOR', (0, 1), (-1, -1), BRAND_DARK),
        # Totals row
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor("#f1f5f9")),
        ('LINEABOVE', (0, -1), (-1, -1), 1.5, BRAND_INDIGO),
        # Grid
        ('BOX', (0, 0), (-1, -1), 0.5, BRAND_SURFACE),
        ('INNERGRID', (0, 0), (-1, -2), 0.25, colors.HexColor("#e2e8f0")),
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
                Paragraph(f"${amount:,.2f}", styles['TableCellRight']),
                Paragraph(f"{pct:.1f}%", styles['TableCellRight']),
            ])

        cat_table = Table(cat_data, colWidths=[60 * mm, 50 * mm, 57 * mm])
        cat_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), BRAND_PURPLE),
            ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, colors.HexColor("#f8fafc")]),
            ('BOX', (0, 0), (-1, -1), 0.5, BRAND_SURFACE),
            ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.HexColor("#e2e8f0")),
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
        f"Invoice #{invoice_no}  •  All amounts in USD",
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

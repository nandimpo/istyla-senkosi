from pathlib import Path
from xml.sax.saxutils import escape
from docx import Document
from docx.text.paragraph import Paragraph as DocxParagraph
from docx.table import Table as DocxTable
from docx.oxml.ns import qn
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, Table, TableStyle, Image
from reportlab.lib.utils import ImageReader
from PIL import Image as PILImage
import io

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'output/report/IStyla_Senkosi_Second_Iteration_Progress_Report.docx'
TARGET=ROOT/'output/report/IStyla_Senkosi_Second_Iteration_Progress_Report.pdf'
doc=Document(SOURCE)
pages=[[]]
for block in doc.iter_inner_content():
    if isinstance(block,DocxParagraph):
        if block._p.xpath('.//w:br[@w:type="page"]'):
            pages.append([])
            continue
        blips=block._p.xpath('.//a:blip')
        if blips:
            rid=blips[0].get(qn('r:embed'))
            data=doc.part.related_parts[rid].blob
            extent=block._p.xpath('.//wp:extent')
            requested=float(extent[0].get('cx'))/12700 if extent else 460
            pages[-1].append(('image',data,requested))
        elif block.text.strip():
            pages[-1].append(('paragraph',block.style.name,block.text.strip()))
    elif isinstance(block,DocxTable):
        pages[-1].append(('table',[[cell.text.strip() for cell in row.cells] for row in block.rows]))

W,H=A4
LEFT=52
RIGHT=52
CONTENT_W=W-LEFT-RIGHT
TOP=56
BOTTOM=48

def build(items,scale):
    out=[]
    for item in items:
        typ=item[0]
        if typ=='paragraph':
            _,kind,txt=item
            if kind=='Title': size,lead,space=22*scale,27*scale,13*scale
            elif kind=='Heading 1': size,lead,space=14.5*scale,18*scale,10*scale
            elif kind=='Heading 2': size,lead,space=10.7*scale,14*scale,6*scale
            elif kind=='Caption': size,lead,space=7.4*scale,10*scale,9*scale
            else: size,lead,space=10.1*scale,14.4*scale,7.5*scale
            name='Helvetica-Bold' if kind in ('Title','Heading 1','Heading 2') else 'Helvetica-Oblique' if kind=='Caption' else 'Helvetica'
            style=ParagraphStyle('x',fontName=name,fontSize=size,leading=lead,textColor=HexColor('#111111'),spaceAfter=space)
            para=Paragraph(escape(txt),style)
            _,h=para.wrap(CONTENT_W,1000)
            out.append((para,h+space))
        elif typ=='image':
            data=item[1]
            im=PILImage.open(io.BytesIO(data)); iw,ih=im.size
            width=min(CONTENT_W,item[2]*scale)
            height=width*ih/iw
            flow=Image(io.BytesIO(data),width=width,height=height)
            out.append((flow,height+4*scale))
        elif typ=='table':
            vals=item[1]; n=len(vals[0]); widths=([CONTENT_W*.19,CONTENT_W*.81] if n==2 else [CONTENT_W*.18,CONTENT_W*.39,CONTENT_W*.43])
            cells=[]
            for ri,row in enumerate(vals):
                line=[]
                for v in row:
                    ps=ParagraphStyle('cell',fontName='Helvetica-Bold' if ri==0 else 'Helvetica',fontSize=7.6*scale,leading=10.2*scale,textColor=HexColor('#FFFFFF') if ri==0 else HexColor('#222222'))
                    line.append(Paragraph(escape(v),ps))
                cells.append(line)
            t=Table(cells,colWidths=widths,hAlign='LEFT',repeatRows=1)
            t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),HexColor('#263744')),('ROWBACKGROUNDS',(0,1),(-1,-1),[HexColor('#FFFFFF'),HexColor('#F3F5F5')]),('GRID',(0,0),(-1,-1),.4,HexColor('#D9D9D9')),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),6*scale),('RIGHTPADDING',(0,0),(-1,-1),6*scale),('TOPPADDING',(0,0),(-1,-1),5*scale),('BOTTOMPADDING',(0,0),(-1,-1),5*scale)]))
            _,h=t.wrap(CONTENT_W,1000)
            out.append((t,h+8*scale))
    return out

c=canvas.Canvas(str(TARGET),pagesize=A4)
for number,items in enumerate(pages,1):
    scale=1.0
    flows=build(items,scale)
    total=sum(h for _,h in flows)
    available=H-TOP-BOTTOM
    while total>available and scale>.76:
        scale-=.025
        flows=build(items,scale)
        total=sum(h for _,h in flows)
    if total>available:
        raise RuntimeError(f'Page {number} still overfull: {total:.0f} > {available:.0f}')
    c.setFillColor(HexColor('#515151')); c.setFont('Helvetica',7)
    c.drawString(LEFT,H-28,'I STYLA SENKOSI  |  SECOND ITERATION')
    c.drawRightString(W-RIGHT,24,f'NANDI MPOFU  •  {number}')
    y=H-TOP
    for flow,h in flows:
        flowh=h-(4*scale if isinstance(flow,Image) else 8*scale if isinstance(flow,Table) else flow.style.spaceAfter)
        flow.drawOn(c,(W-flow.drawWidth)/2 if isinstance(flow,Image) else LEFT,y-flowh)
        y-=h
    c.showPage()
    print(f'page {number}: {len(items)} blocks, scale {scale:.3f}, used {total:.1f}/{available:.1f}')
c.save()
print(TARGET)

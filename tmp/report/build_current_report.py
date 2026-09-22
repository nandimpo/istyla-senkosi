from pathlib import Path
import re
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, KeepTogether, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from pypdf import PdfReader
from pdf2image import convert_from_path
from PIL import Image as PILImage, ImageOps, ImageDraw

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'output/report/IStyla_Senkosi_Detailed_Progress_Report_22_September_2026.md'
OUT=ROOT/'output/pdf/IStyla_Senkosi_Detailed_Progress_Report_22_September_2026.pdf'
QA=ROOT/'tmp/report/current-report-qa'
OUT.parent.mkdir(parents=True,exist_ok=True); QA.mkdir(parents=True,exist_ok=True)
for name,f in [('Body','arial.ttf'),('Bold','arialbd.ttf'),('Italic','ariali.ttf')]:
 pdfmetrics.registerFont(TTFont(name,'C:/Windows/Fonts/'+f))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='Bold',italic='Italic',boldItalic='Bold')
styles={
 'body':ParagraphStyle('body',fontName='Body',fontSize=10.2,leading=14.1,spaceAfter=7,textColor=HexColor('#252525'),splitLongWords=True),
 'title':ParagraphStyle('title',fontName='Bold',fontSize=24,leading=28,spaceAfter=18,textColor=HexColor('#000000')),
 'h2':ParagraphStyle('h2',fontName='Bold',fontSize=17,leading=21,spaceAfter=12,keepWithNext=True),
 'h3':ParagraphStyle('h3',fontName='Bold',fontSize=11.4,leading=15,spaceBefore=8,spaceAfter=7,keepWithNext=True),
 'list':ParagraphStyle('list',fontName='Body',fontSize=10,leading=13.7,leftIndent=12,firstLineIndent=-9,spaceAfter=5,splitLongWords=True),
 'caption':ParagraphStyle('caption',fontName='Body',fontSize=9,leading=12,spaceAfter=12),
}
def markup(s):
 s=s.replace('—','-').replace('–','-').replace('‑','-')
 s=escape(s)
 s=re.sub(r'\*\*(.*?)\*\*',r'<b>\1</b>',s)
 s=re.sub(r'`([^`]+)`',lambda m:'<font size="9">'+m.group(1)+'</font>',s)
 return s
flow=[];buffer=[];figures=[];captions=[]
def flush():
 global buffer
 if buffer:
  content=' '.join(buffer)
  if content.startswith('**Figure '):captions.append(Paragraph(markup(content),styles['caption']))
  else:flow.append(Paragraph(markup(content),styles['body']))
  buffer=[]
def flush_figures():
 if figures:
  t=Table([figures,captions],colWidths=[249,249]);t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('ALIGN',(0,0),(-1,0),'CENTER'),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),8)]));flow.append(t);figures.clear();captions.clear()
for line in SOURCE.read_text(encoding='utf-8').splitlines():
 if not line.strip():flush();continue
 if line=='<!-- page -->':flush();flush_figures();flow.append(PageBreak());continue
 if line.startswith('# '):flush();flow.append(Paragraph(markup(line[2:]),styles['title']));continue
 if line.startswith('## '):flush();flow.append(Paragraph(markup(line[3:]),styles['h2']));continue
 if line.startswith('### '):flush();flow.append(Paragraph(markup(line[4:]),styles['h3']));continue
 if line.startswith('!['):
  flush();imgpath=(SOURCE.parent/re.search(r'\]\((.*)\)',line).group(1)).resolve()
  im=PILImage.open(imgpath);h=380;w=h*im.width/im.height
  figures.append(Image(str(imgpath),width=w,height=h));continue
 if line.startswith('- '):flush();flow.append(Paragraph('&#8226; '+markup(line[2:]),styles['list']));continue
 if re.match(r'^\d+\. ',line):flush();flow.append(Paragraph(markup(line),styles['list']));continue
 buffer.append(line)
flush()
def furniture(c,d):
 c.saveState();c.setFont('Body',8);c.setFillColor(HexColor('#555555'))
 c.drawString(48,811,'I STYLA SENKOSI  /  PROJECT REVIEW')
 c.drawRightString(547,811,'22 SEPTEMBER 2026')
 c.setStrokeColor(HexColor('#D9D9D9'));c.line(48,801,547,801)
 c.drawString(48,29,'Current files reviewed at commit 35c9421')
 c.drawRightString(547,29,str(d.page));c.restoreState()
doc=SimpleDocTemplate(str(OUT),pagesize=(595.276,841.89),leftMargin=48,rightMargin=48,topMargin=55,bottomMargin=48,title='I Styla Senkosi Detailed Progress Report',author='Project review prepared for Nandi Mpofu')
doc.build(flow,onFirstPage=furniture,onLaterPages=furniture)
pdf=PdfReader(OUT);print('PDF pages',len(pdf.pages));print('Words',len(SOURCE.read_text(encoding='utf-8').split()))
renders=convert_from_path(str(OUT),dpi=100)
thumbs=[]
for i,p in enumerate(pdf.pages):
 renders[i].save(QA/f'page-{i+1:02d}.png')
 im=PILImage.open(QA/f'page-{i+1:02d}.png').convert('RGB');im.thumbnail((238,337))
 tile=PILImage.new('RGB',(258,369),'#dddddd');tile.paste(im,((258-im.width)//2,10));ImageDraw.Draw(tile).text((10,350),f'Page {i+1}',fill='black');thumbs.append(tile)
 print(i+1,len(p.extract_text().split()),p.extract_text().splitlines()[4:6])
for start in range(0,len(thumbs),8):
 subset=thumbs[start:start+8];sheet=PILImage.new('RGB',(258*4,369*2),'#bbbbbb')
 for j,im in enumerate(subset):sheet.paste(im,((j%4)*258,(j//4)*369))
 sheet.save(QA/f'contact-{start//8+1}.png')

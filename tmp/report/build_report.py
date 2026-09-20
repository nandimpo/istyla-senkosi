from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.style import WD_STYLE_TYPE
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'output' / 'report' / 'IStyla_Senkosi_Second_Iteration_Progress_Report.docx'
IMG = ROOT / 'tmp' / 'report'

doc = Document()
sec = doc.sections[0]
sec.top_margin = Inches(.72)
sec.bottom_margin = Inches(.62)
sec.left_margin = Inches(.83)
sec.right_margin = Inches(.83)
sec.header_distance = Inches(.32)
sec.footer_distance = Inches(.30)

styles = doc.styles
normal = styles['Normal']
normal.font.name = 'Aptos'
normal.font.size = Pt(10.2)
normal.font.color.rgb = RGBColor(31, 31, 31)
normal.paragraph_format.line_spacing = 1.18
normal.paragraph_format.space_after = Pt(6.2)
for name, size, before, after in [('Title', 24, 0, 13), ('Heading 1', 15, 0, 10), ('Heading 2', 11, 10, 5)]:
    s = styles[name]
    s.font.name = 'Aptos Display' if name != 'Heading 2' else 'Aptos'
    s.font.size = Pt(size)
    s.font.bold = True
    s.font.color.rgb = RGBColor(0, 0, 0)
    s.paragraph_format.space_before = Pt(before)
    s.paragraph_format.space_after = Pt(after)
    s.paragraph_format.keep_with_next = True
if 'Caption' not in styles:
    styles.add_style('Caption', WD_STYLE_TYPE.PARAGRAPH)
cap = styles['Caption']
cap.font.name = 'Aptos'
cap.font.size = Pt(8)
cap.font.italic = True
cap.font.color.rgb = RGBColor(68, 68, 68)
cap.paragraph_format.space_after = Pt(8)

def p(txt='', style=None):
    return doc.add_paragraph(txt, style=style)

def h1(txt):
    doc.add_heading(txt, 1)

def h2(txt):
    doc.add_heading(txt, 2)

def bullet(txt):
    z = doc.add_paragraph(style='List Bullet')
    z.add_run(txt)
    z.paragraph_format.space_after = Pt(2)

def figure(filename, caption, width=6.45):
    q=doc.add_paragraph()
    q.alignment=WD_ALIGN_PARAGRAPH.CENTER
    q.paragraph_format.space_after=Pt(2)
    q.add_run().add_picture(str(IMG / filename), width=Inches(width))
    c=p(caption, 'Caption')
    c.alignment=WD_ALIGN_PARAGRAPH.CENTER

def table(headers, rows, widths=None):
    t=doc.add_table(rows=1, cols=len(headers))
    t.alignment=WD_TABLE_ALIGNMENT.CENTER
    t.autofit=False
    if widths:
        for cell,w in zip(t.rows[0].cells,widths): cell.width=Inches(w)
    for i,v in enumerate(headers): t.rows[0].cells[i].text=v
    for row in rows:
        cells=t.add_row().cells
        for i,v in enumerate(row): cells[i].text=str(v)
    for ri,row in enumerate(t.rows):
        for cell in row.cells:
            cell.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
            tcPr=cell._tc.get_or_add_tcPr()
            shd=OxmlElement('w:shd'); shd.set(qn('w:fill'), '263744' if ri==0 else ('F3F5F5' if ri%2==0 else 'FFFFFF')); tcPr.append(shd)
            borders=OxmlElement('w:tcBorders')
            for edge in ['top','left','bottom','right']:
                e=OxmlElement('w:'+edge); e.set(qn('w:val'),'single'); e.set(qn('w:color'),'D9D9D9'); e.set(qn('w:sz'),'4'); borders.append(e)
            tcPr.append(borders)
            mar=OxmlElement('w:tcMar')
            for edge in ['top','left','bottom','right']:
                e=OxmlElement('w:'+edge); e.set(qn('w:w'),'85'); e.set(qn('w:type'),'dxa'); mar.append(e)
            tcPr.append(mar)
            for pp in cell.paragraphs:
                pp.paragraph_format.space_after=Pt(0)
                pp.paragraph_format.line_spacing=1.05
                for r in pp.runs:
                    r.font.name='Aptos'; r.font.size=Pt(8)
                    if ri==0: r.font.bold=True; r.font.color.rgb=RGBColor(255,255,255)
    doc.add_paragraph().paragraph_format.space_after=Pt(1)
    return t

def page():
    doc.add_page_break()

# 1 Cover and summary
title=p('I Styla Senkosi Second Iteration Progress Report','Title')
p('Past Present and Future of Township Fashion')
p('Nandi Mpofu  |  Visual Storytelling  |  Individual project')
p('Project: https://nandimpo.github.io/istyla-senkosi/  |  Trello: https://trello.com/b/J9oIZa54/istyla-senkosi')
h2('Report overview')
p('This report documents the second iteration of I’styla Senkosi, an interactive documentary about township fashion. The most important change since the first prototype is a sharper narrative: Jama’s journey now has a personal question that connects the three fashion chapters to the ending. I also revised the map and menu, began a closer edit of the video, changed the music sequence, adjusted the presentation of narrative text, and added actions that bring the viewer into the experience.')
p('My previous feedback was encouraging about visual progress but clear about the weakness in my reporting and story. I had shown what I built without explaining enough of my thinking. Ashleigh Alexander also asked for more visible footage, smoother music changes, specific milestones, rough process evidence and stronger authorship. This report therefore connects each significant change to the problem I was trying to solve and identifies what remains uncertain.')
h2('Current position')
table(['Established in the draft','Still to prove or resolve'],[
    ['Working chapter structure and core interactions','Whether first-time viewers can follow Jama’s change'],
    ['Narrative text and music fades are implemented','Voiceover versus on-screen text needs a playtest'],
    ['A more interactive, contextual map','Final editorial media and colour treatment need review'],
    ['Early wireframes and dated revisions are documented','Jama’s grief and her cousin’s own perspective need careful handling'],
], [3.1,3.5])
p('The report distinguishes documented implementation from audience outcomes. A feature existing in the website does not, by itself, establish that the documentary communicates its meaning.')

# 2 Introduction
page(); h1('1 Introduction')
h2('1.1 The project and its central question')
p('I’styla Senkosi examines Swenka, Pantsula and Skhothane as fashion cultures through which people communicate identity and belonging. It combines archival and contemporary imagery, interview material, moving footage, sound and website interactions. The project developed from my difficulty finding accessible, detailed sources about township fashion. That research gap led me to interviews and first-hand visual material, documented in my earlier progress presentation.')
p('The documentary uses Jama as the viewer’s guide. Her cousin, who was a Skhothane, has died. She travels from Johannesburg North towards Soweto with questions she can no longer ask him. In the chapters, she observes care in dressing, movement and collective performance, then questions the judgments she made about his style while he was alive. This personal thread gives the material a direction beyond a sequence of beautiful images. Section 3.4 explains how I brought the current website back into line with the bereavement premise recorded in the August presentations.')
h2('1.2 What this report covers')
p('Section 2 sets out the goals for the second iteration and defines requirements, assumptions, affordances, constraints and success criteria. Section 3 follows the process from early wireframes through the 15 and 31 August presentations. It explains the narrative, music, text and interaction decisions, including choices I found difficult. Section 4 describes the current clean draft chapter by chapter and identifies the evidence visible in the work. Section 5 evaluates the result against the iteration goals, separates completed work from work in progress, and sets a specific four-week plan. Section 6 concludes with the next editorial and testing decisions.')
h2('1.3 My role and method of reflection')
p('I have worked on the project alone. I have been responsible for the concept, research, asset organisation, narrative writing, visual design, development and assembly of the documentary experience. My earlier presentation names interviewees and creative collaborators; those contributions do not make this a group development project. Working independently gives me a consistent creative direction, but it also creates a practical constraint: time spent implementing an interaction can displace time needed for video editing and narrative revision.')
p('I use the dated presentations as a record of what I intended and what I had completed at each point. I use the current draft to describe implemented behaviour. Where I offer an interpretation, such as the meaning of an interaction, I treat it as my design intention until viewer feedback confirms or challenges it.')

# 3 Goals
page(); h1('2 Project Goals')
h2('2.1 Goals for this iteration')
p('My first iteration established a navigable React prototype. The second iteration needs to make the experience legible as a story. I want Jama’s motivation, the differences between the chapters and the change in her perspective to be apparent while the viewer is using the documentary. The priority is to make form serve meaning: imagery, sound, text and interaction should each help the viewer understand something.')
table(['Goal','Observable criterion'],[
    ['Clarify Jama’s story','A viewer can say why her cousin’s death sends her on this journey, what changes in each chapter and what remains unknowable.'],
    ['Make chapters distinct','Swenka, Pantsula and Skhothane differ in subject, pace, sound and interaction for reasons the report can explain.'],
    ['Improve continuity','Music changes do not distract during quick navigation; transitions preserve the sense of one journey.'],
    ['Protect image clarity','Facial expression, garment detail and movement remain visible in key footage.'],
    ['Make participation meaningful','A viewer can explain how at least two interactions relate to the chapter rather than describing them as obstacles.'],
    ['Document the process','Rough work, revisions, testing observations and the reasons for decisions are shown alongside final visuals.'],
],[2.2,4.4])
h2('2.2 Requirements and assumptions')
p('The draft requires a clear entrance, readable navigation, a sequence through the three fashion cultures, a reflection, visible documentary media, sound controls and usable interactions. It also requires captions or on-screen text that convey the essential story when music is muted. For this report, the assignment calls for a current progress list, an updated three-to-four-week plan, the Trello link, and screenshots showing current visual and narrative direction.')
p('I assume viewers may be unfamiliar with the history and language of these styles, so the project must provide context without turning each page into an explanatory article. I also assume that viewers may watch on different screen sizes and may choose silence or reduced motion. These are design assumptions, not tested facts. The current menu includes sound, volume and reduced-motion controls; their usability still needs evaluation.')
h2('2.3 Affordances and constraints')
p('The browser lets me reveal material through scrolling, dragging, clicking and swiping. Those actions can connect the audience to dressing, movement and discovery. The same affordances can slow the story when their purpose is unclear. Large video and audio files create performance and quality trade-offs. My time is divided between editing media, writing and coding. The limited availability of deeply researched fashion archives also makes careful attribution and first-hand testimony important.')

# 4 evidence chronology
page(); h1('3 Process')
h2('3.1 From preproduction to the first prototype')
p('The early progress presentation records research through articles, interviews and site visits, along with folders of historical references, street imagery, textiles, interviews and video. It also shows low-fidelity wireframes for the landing page and each chapter. This early planning mattered because it tested the broad structure before I committed to a full build. At that stage, however, the wireframes were stronger at allocating space for headings and activities than at explaining what Jama would discover.')
figure('early-wireframes.png','Figure 1. Early chapter wireframes from the initial progress presentation. The layouts establish a sequence of interactions and media areas but leave the narrative development to be worked through in later iterations.',6.4)
p('The first iteration turned that structure into a functioning site with chapter navigation, media and interactions. My previous report described these additions extensively. The feedback exposed a gap: a functioning documentary framework can still leave the audience unsure whose story it is and why the chapters follow one another. That became the starting point for the second iteration.')
h2('3.2 The 15 August revisions')
p('By 15 August I had repaired the menu and chapter navigation, developed the map, added animated text, begun editing video in DaVinci Resolve and started replacing placeholders. The presentation compares the original map with a revised version. The original was flat, blurry and difficult to connect to the narrative. The revision adds a journey from Johannesburg North towards Soweto and more contextual text. I treated the map as a way of locating Jama’s movement, rather than as a decorative navigation screen.')

# 5 map menu
page(); h1('3 Process Continued')
h2('3.2 The map and menu as orientation')
figure('map-revision.png','Figure 2. The 15 August presentation compares the earlier map with a more interactive version that places Jama’s journey in context.',6.5)
p('The map revision taught me that clarity and narrative purpose are connected. The previous map asked the user to move through space without clearly establishing why that movement mattered. Adding location labels and a clearer visual journey made it easier to relate the interface to Jama’s shift from familiar surroundings towards Soweto. I still need a first-time viewer to test whether the map communicates this without an explanation from me.')
p('The menu had a similar problem of expectation. In the 15 August presentation, I noted that calling a control “Menu” could lead viewers to expect settings, while my earlier version did not deliver them. I revised it to include sound control, a volume slider, reduced-motion settings and a profile area. This was a response to how viewers interpret a familiar interface word. It also gave them practical control over a documentary in which music and animation are prominent.')
h2('3.3 From a prototype to an authored journey')
p('My hardest task was turning a visually compelling website into a story. I had material for each fashion chapter, but the relationship between the images and Jama’s loss was initially weak. I began to make each chapter answer a different question: what does preparation say about identity, what does movement communicate, and how can spectacle be misread from a distance? These questions helped me choose where narration was needed and where the media could carry the meaning itself. They also let Jama’s grief become more specific than a statement that she misses someone.')
p('The 31 August presentation records a stronger set of chapter introductions and narrative beats, reduced dark overlays, music fades and distinct transitions. I take that presentation as evidence of my intended direction. I still need to compare those claims with the current footage on different screens and with an audience, especially for visibility and pacing.')

# 6 story
page(); h1('3 Process Continued')
h2('3.4 Clarifying loss as the centre of the story')
p('The August presentations state the premise clearly: Jama explores township fashion after the death of her cousin, who was a Skhothane. Some later website text drifted into a different story, ending with Jama planning to speak to him. That wording made the ending impossible and weakened the link between memory and the journey. I revised the introduction, chapter text, map and reflection so his death is acknowledged from the beginning and never treated as a surprise that exists only for dramatic effect.')
p('This correction changes the purpose of the ending. Jama cannot recover her cousin’s answers or claim to know exactly why he dressed as he did. She can remember him more carefully and listen to living participants speak for themselves. I want the audience to leave with the weight of what was not asked, as well as a stronger understanding of the styles that shaped his world. The Skhothane chapter now names his connection explicitly and slows down before the reflection. I still need to test whether that emotional beat is earned by the preceding chapters.')
h2('3.5 Finding the place for narration')
p('I struggled with how much narrative text to put on screen and where to place it. Too little text left Jama’s experience and grief implicit. Too much covered the very footage that should help tell the story. Music complicated the decision because text has its own reading pace, while a song creates another rhythm. I therefore placed brief first-person observations at moments when Jama’s interpretation changes, rather than describing every image. I used quieter passages and the space between clips for more reflective lines.')
p('My working test is whether each line does something specific. It should explain an unfamiliar context, reveal a question, or show a shift in Jama’s perspective. If it merely repeats what the photograph already shows, it can be removed. If a key idea is only available through sound, it should also be conveyed visually or in text. I have not yet completed the planned comparison of voiceover and on-screen text with users, so the final balance remains open.')
h2('3.6 Rough work as evidence')
p('The early wireframes, the map comparison and the 31 August narrative sketch show three different kinds of preproduction: page structure, interface revision and story planning. In the final submission I should include the actual sketch or script annotations used to decide the chapter beats, with a date and a caption explaining what changed. That will make the process visible rather than presenting a polished screen as though it emerged in one step.')

# 7 text visual
page(); h1('3 Process Continued')
h2('3.7 Stitching narrative text into the visual language')
p('I wanted the text to feel connected to clothing and material. The stitched and embroidered animation was difficult to develop because the effect had to remain readable while looking tactile. My first version placed it on orange fabric. I found that treatment too harsh: the bright surface competed with the words and with the footage behind it. I replaced it with an opaque, quieter background so the line could be read without making the whole screen feel like a banner.')
p('That choice illustrates a recurring tension in the project. A fashion documentary benefits from texture and strong colour, but an expressive treatment can become dominant. I kept the idea of thread and stitching because it gives the narration a material link to garments; I changed the surrounding surface because legibility mattered more than preserving the first visual idea. The current build includes stitched narrative text with a backing treatment and a reduced-motion path. I need to verify the contrast over both dark and bright images and check how long the animation makes viewers wait before they can read.')
figure('current-swenka.png','Figure 3. Current Swenka opening. Jama remembers the care her cousin took in dressing, while the darker backing keeps the text legible over footage.',4.5)
h2('3.8 Reconsidering darkness and footage')
p('Ashleigh’s feedback that the work felt too dark was especially important because fashion detail is part of the evidence. If the viewer cannot see fabric, gesture and expression, the visual argument weakens. The 31 August presentation records reduced dark overlays, while the current styles still use darker treatments for some reflective frames. I do not want to remove contrast indiscriminately: the quieter ending needs a different mood from the energetic chapters. I will review representative video frames at normal screen brightness and adjust any treatment that hides meaningful detail.')
h2('3.9 Visual design and meaning')
p('The early visual direction combined earth tones, documentary imagery, layered collage, textile references and expressive type. I kept this broad language because it relates to physical clothing and street environments. The more useful design question now is what each visual treatment tells the viewer. The Swenka material needs space for close attention to dress. Pantsula needs movement and rhythm to remain legible. Skhothane can sustain greater colour and density, but still needs a deliberate pause for the cousin connection. The visual system succeeds only when these differences are perceived in the work, not just described here.')

# 8 audio interaction
page(); h1('3 Process Continued')
h2('3.10 Music as a pacing decision')
p('I changed the music because the earlier sequence did not give the chapters a clear sense of time or movement. My 31 August presentation maps the journey from a slower opening through Swenka, Pantsula and Skhothane towards a reflective ending. The current website uses a different track for each chapter and an audio fade when the active section changes. This is an intentional progression in energy, but the songs should not be treated as exact historical evidence for the eras depicted. I need to check credits and usage rights before final distribution.')
figure('music-pacing.png','Figure 4. The 31 August pacing slide pairs chapter music with a narrative progression from introduction through climax and reflection.',6.45)
p('I still need to listen to the journey as a user would. A crossfade that sounds smooth during normal progression may feel different when someone skips rapidly between pages. I will test the transition at ordinary and fast navigation speeds, with headphones and speakers, then note any abrupt start, volume jump or clash with narration.')
h2('3.11 Making the viewer participate')
p('The experience felt too stationary when the viewer only watched footage and scrolled. I added the unzip entry to Swenka and a Converse lacing action in Pantsula to make entry and preparation physical. The unzip gesture connects to the care of dressing before the Swenka chapter opens. Lacing a shoe can prepare the viewer for movement in Pantsula. I also revised the map so dragging retraces a journey rather than merely exposing an illustration.')
p('These ideas still need a critical test. If the actions help viewers notice dress and movement, they support the story. If they feel like compulsory tasks between clips, I should shorten them, make their purpose clearer or provide an accessible route through them.')

# 9 clean draft first
page(); h1('4 Current Clean Draft')
h2('4.1 Structure and level of completion')
p('The current website has an introduction, Swenka, Pantsula, Skhothane and a final reflection. A shared chapter presentation framework supports image sequences, video, narrative text, sound and chapter navigation. The current draft is therefore more integrated than a collection of disconnected prototype screens. Its central premise is now consistent: Jama’s cousin has died. It remains a clean draft because captions, media choices, grading and the emotional pacing still need editorial work.')
table(['Beat','What is currently present','What the viewer should understand'],[
    ['Opening','Jama names her cousin’s death and leaves familiar Johannesburg surroundings.','Unanswered questions about him motivate the route to Soweto.'],
    ['Swenka','Careful dress, image sequences, documentary clips and clothing actions.','Preparation and self-presentation carry meaning.'],
    ['Pantsula','Dance footage, movement imagery and beat or lacing actions.','Style is enacted collectively through rhythm and motion.'],
    ['Skhothane','High colour, spectacle, image carousel and a pause for his memory.','Jama questions the judgment she made of her cousin.'],
    ['Reflection','Cousin photographs and a quieter sequence.','She cannot speak for him, but can remember and listen more carefully.'],
],[1.2,2.55,2.85])
h2('4.2 Introduction and Swenka')
p('The introduction now carries more narrative responsibility than the early wireframe. Jama names her cousin’s death and the question she cannot ask him. The map has a clearer route and asks the audience to retrace it. Swenka then shifts attention to careful dressing and detail. A wardrobe action and shoe-related interaction echo that focus. I want the audience to notice the labour of presentation before hearing Jama remember that labour in her cousin.')
figure('current-introduction.png','Figure 5. Current introduction screen. Jama names her cousin’s death before the fashion chapters, giving the route to Soweto a personal motive.',4.5)
p('The risk is that the current Swenka chapter contains several visual and interactive modes in quick succession. During the dry run I should watch for a clear rhythm between observation, testimony and action. Each clip needs a meaningful entry and exit, and each interaction needs to earn the time it occupies.')

# 10 clean draft rest
page(); h1('4 Current Clean Draft Continued')
h2('4.3 Pantsula')
p('Pantsula changes the documentary’s energy. The current chapter combines historical and contemporary imagery, dance footage, a lacing moment and a beat interaction. Jama’s text moves from watching at a distance towards wanting to try the rhythm. The action can make that shift tangible. It also creates the chapter’s main usability risk: a viewer should understand the relation between the shoe, the rhythm and the story without needing a presenter to explain it.')
h2('4.4 Skhothane')
p('The Skhothane chapter uses colour, collage and swiping to bring spectacle to the foreground. Its strongest moment is a slowdown in which Jama names her cousin’s connection to the style, remembers that she dismissed his clothes as showing off, and admits she never asked why he dressed that way. His absence gives the pause an emotional purpose beyond visual intensity. The current frame sequence includes a label referring to a moment “after interviews”; I need to verify that the selected interviews are actually present and that the transition makes sense. The chapter should also avoid implying that every person represented shares one motive for dressing this way.')
figure('current-skhothane.png','Figure 6. Current Skhothane opening. Jama identifies her late cousin as a Skhothane and acknowledges how quickly she judged his outfits.',4.5)
h2('4.5 Reflection and the unanswered question')
p('The reflection uses photographs of Jama’s cousin and quieter street images. She recognises that his reasons were his own and that she can no longer ask him for them. This leaves the story with an honest limit rather than a complete explanation. The ending can still look forward: Jama can carry the memory more carefully and continue listening to people who can describe their own relationship to these styles. I need to make that future movement visible enough to fulfil the project’s title without pretending that grief has been neatly resolved.')
h2('4.6 Evidence and remaining editorial tasks')
p('The current draft can demonstrate its chapter flow, interactive moments, image treatment, narrative text and sound settings. The current screenshots in this report show the opening, Swenka and Skhothane narrative direction. Before final submission, I will replace duration captions that still read as production notes, check the visible sequence against the script and review footage grading. I present the early wireframe, the 15 August map comparison and the 31 August narrative diagram as dated process evidence so they are not confused with final screens.')

# 11 evaluation
page(); h1('5 Evaluation')
h2('5.1 What the second iteration has achieved')
p('The strongest result is a clearer relationship between the chapters. I can now explain why Swenka leads to Pantsula, why Skhothane creates a more personal confrontation, and why the reflection returns to the cousin. This addresses the feedback about authorship more directly than adding another effect would have done. The map, menu, music fades and more deliberate narrative text also answer specific concerns raised during earlier reviews.')
p('The process changed my way of judging progress. Earlier, I tended to count completed pages and features. Now I ask what a viewer learns at each beat. That shift has been difficult because removing or simplifying an effect can feel like losing work. The orange fabric behind the embroidered text is an example: changing it improved the text’s role, even though the first treatment looked more striking in isolation.')
h2('5.2 What remains weak or unproven')
p('The premise is now consistent with the August presentations, but the project still needs evidence that its meaning is legible to people who have not heard my explanation. I have not supplied documented audience testing for this report, so I cannot claim that viewers understand the story, the controls or the historical relationships. I also need to check that grief does not become a device that speaks over the cultural participants. Image visibility and audio transitions have been revised, but need review on real devices. The “future” promised in the subtitle needs a more explicit place in the ending or title.')
table(['Status','Evidence','Next action'],[
    ['Done','Early wireframes, chapter structure, revised map and menu, chapter music and narrative text.','Document the decisions alongside screenshots.'],
    ['In progress','Video editing, visual clarity, grief and memory beats, text and music pacing.','Conduct a complete editorial pass.'],
    ['Awaiting test','Audience comprehension, interaction meaning, rapid music changes, mobile readability.','Run and record a dry run with first-time viewers.'],
    ['Editorial limit','The cousin cannot explain his motives directly.','Avoid assigning motives to him; use his photographs and living participants carefully.'],
],[1.15,2.6,2.85])

# 12 plan conclusion
page(); h1('5 Evaluation Continued')
h2('5.3 Specific four week plan')
table(['Week','Work and deliverable'],[
    ['1 Story','Revise the five-beat outline around Jama’s loss and identify one change in her perspective per chapter. Remove repeated lines. Make the final unanswered question and the project’s future dimension clear.'],
    ['2 Editorial','Replace production captions. Check the Skhothane interview reference. Review five representative footage frames for darkness. Compare voiceover and on-screen text over one complete chapter. Adjust chapter sound levels and rapid page changes.'],
    ['3 Test','Ask three first-time viewers to complete the journey without explanation. Record where they pause, skip or misunderstand. Ask what Jama wanted, what changed, and what each interaction added. Prioritise findings by effect on comprehension.'],
    ['4 Refine','Revise the two most disruptive story or usability issues. Complete a desktop and mobile dry run, capture current screenshots, add dated rough work, update the Trello board and proofread the final report.'],
],[.75,5.85])
h1('6 Conclusion')
p('This second iteration moves I’styla Senkosi towards an authored documentary. The early work established the site and its visual language; the present work gives Jama a question that can hold the material together. My most consequential decisions concern the placement of narration, the pacing of music, the legibility of stitched text and the viewer’s participation through actions such as unzipping and lacing. Each decision has strengthened the draft, but the final result depends on whether a viewer can experience the story without my explanation.')
p('My immediate next step is to test whether the revised story of loss is clear without my explanation. I will use the results to decide what to cut, clarify or extend. I will also complete the media and accessibility checks and document the rough work behind the polished interface. These tasks are more specific than a general promise to add animation: they identify the work required to make the documentary readable, credible and ready for its final iteration.')
h2('Evidence used in this report')
p('Module 2 First Iteration and Progress Report; initial Progress Presentation; Progress Presentation dated 15 August; Progress Presentation dated 31 August; current I’styla Senkosi website files; Trello board at https://trello.com/b/J9oIZa54/istyla-senkosi/.')

header=sec.header.paragraphs[0]
header.text='I STYLA SENKOSI  |  SECOND ITERATION'
header.style=styles['Caption']
footer=sec.footer.paragraphs[0]
footer.alignment=WD_ALIGN_PARAGRAPH.RIGHT
footer.add_run('NANDI MPOFU   •   ')
fld=OxmlElement('w:fldSimple'); fld.set(qn('w:instr'),'PAGE'); footer._p.append(fld)

OUT.parent.mkdir(parents=True, exist_ok=True)
doc.save(OUT)
print(OUT)

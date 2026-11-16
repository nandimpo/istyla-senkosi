# Editorial review

## Emotional purpose

| Section | Jama discovers | Visitor should feel |
| --- | --- | --- |
| Introduction | Her questions about Ree lead her beyond familiar places and assumptions. | Curiosity |
| Swenka | Care in clothing can communicate pride, dignity and self-respect. | Respect and admiration |
| Pantsula | Fashion gains meaning through music, movement and community. | Energy and belonging |
| Skhothane | Bold clothing can carry meaning beyond her first impression. | Surprise and understanding |
| Reflection | She can remember Ree with a deeper appreciation while acknowledging unanswered questions. | Connection and reflection |

## Recurring motif

The existing `Cousin_Old_Photo.png` appears at the beginning, in Swenka's personal memory and in the final reflection. The photograph remains the same while Jama's attention changes. These passages are her interpretation, not historical evidence or quotations from Ree.

## Reflective transitions

- Swenka: returning to Ree's photograph after examining the hat, sleeve and shoes connects careful observation to a personal memory. The narration acknowledges that Swenka cannot answer for Ree.
- Pantsula: after participation, Jama notices music, movement and people responding to each other, then connects belonging to her wish to tell Ree.
- Skhothane: after hearing others, Jama questions her first impression of spectacle and returns to the meaning she never asked Ree to explain.

## Design and density

- Shared display/body/caption typography, rectangular navigation buttons, page gutters, focus states, audio position and motion tokens live in `src/styles/DesignSystem.css`.
- Introduction: one complete photograph and a separate text column establish the memory; the requested Soweto backdrop stays faint.
- Swenka: the personal memory uses one stationary photograph, separate from archival collage scenes.
- Pantsula: `TRYING TO KEEP TIME` is one still photograph with adjacent narration, replacing three moving photographs during the personal reflection.
- Skhothane: the album narration is shorter, with one photograph at a time; the finale keeps its expressive collage but gives narration an opaque reading surface.
- Reflection: still images, clear text columns, gentle fades and a restrained final photograph/text layout provide a quieter ending.

## Interaction meaning

Invitation, participation, feedback and reflection are present across the map, wardrobe, rhythm and carousel/outfit activities. The wardrobe's final reflection waits for an explicit Continue action. Rhythm progression names the next movement and its replay is optional. The carousel closes with a change in Jama's interpretation rather than only an image count. Outfit choices have no correct answer and lead into personal voices.

## Video edit and audio method

`python scripts/prepare-editorial-clips.py` exports six browser-ready copies, preserving the source files. The existing short Swenka and Pantsula edits retain their full passages; Skhothane expression and voices retain their existing first-20-second selection. This avoids inventing new speech edits without a verified transcript.

The primary selections are Swenka's introduction (dress and presentation), Pantsula's first movement sequence (clothing in coordinated movement), and Skhothane's opening expression sequence (pattern, performance and group recognition). Sample frames were inspected for these three selections. The second clip in each chapter keeps the additional voices/performance context.

Each output uses H.264, AAC at 48 kHz, a maximum 1280-pixel width and fast-start MP4 metadata. This replaces the PCM-audio MOV delivery in Pantsula. Two-pass loudness matching targets -16 LUFS with a -1.5 dBTP ceiling; measured results are saved in `src/assets/edited-clips/audio-report.json`. This matches overall clip levels; it does not separately remix speech and music already combined inside a source recording. The site's added background soundtrack is reduced to 1% of the chosen volume during chapter videos. Video audio and rhythm feedback respect shared sound/volume settings.

## Validation and remaining review

- Production build passed. All six exported MP4s decoded without errors; codec/duration results are saved in `review/media-validation.json`.
- The configured live URL is https://nandimpo.github.io/istyla-senkosi/ and returned HTTP 200 during this review.
- Its entry bundle differs from the current local build. The new edited clips have not been deployed or checked in live playback.
- A listening review is still needed to judge speech clarity within the source mixes. Full verbatim captions are not supplied; the current reading option contains scene context and observations.
- Credits and acknowledgements now open separately from Home. A complete archival source/creator credit list still needs verified attribution data.

## Checklist status

- [x] Write the emotional purpose of all five sections.
- [x] Identify and repeat an existing motif connecting Jama and Ree.
- [x] Improve a reflective transition in each fashion chapter.
- [x] Select the existing key video passages and export web-ready edits.
- [x] Match overall levels across the six chapter clips and reduce the added soundtrack during videos.
- [ ] Complete a listening review of speech versus music within the original recordings.
- [ ] Deploy the new build and check the edited clips in the live website.
- [x] Standardise headings, body text, buttons and captions.
- [x] Simplify at least one reading or reflective section in each chapter.
- [x] Add meaningful feedback and reflection to interactive activities.

import { FormElementsType } from '@/types/types'
import { TextFieldFormElement } from '../fields/TextField'
import { TitleFieldFormElement } from '../fields/TitleField'
import { SubtitleFieldFormElement } from '../fields/SubtitleField'
import { ParagraphFieldFormElement } from '../fields/ParagraphField'

export const FormElements: FormElementsType = {
    TextField: TextFieldFormElement,
    TitleField: TitleFieldFormElement,
    SubtitleField: SubtitleFieldFormElement,
    ParagraphField: ParagraphFieldFormElement,
}

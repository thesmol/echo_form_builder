import { FormElementsType } from '@/types/types'
import { TextFieldFormElement } from '../fields/TextField'
import { TitleFieldFormElement } from '../fields/TitleField'
import { SubtitleFieldFormElement } from '../fields/SubtitleField'
import { ParagraphFieldFormElement } from '../fields/ParagraphField'
import { SeparatorFieldFormElement } from '../fields/SeparatorField'
import { SpacerFieldFormElement } from '../fields/SpacerField'
import { NumberFieldFormElement } from '../fields/NumberField'
import { TextAreaFieldFormElement } from '../fields/TextAreaField'
import { DateFieldFormElement } from '../fields/DateField'

export const FormElements: FormElementsType = {
    TextField: TextFieldFormElement,
    NumberField: NumberFieldFormElement,
    TextAreaField: TextAreaFieldFormElement,
    DateField: DateFieldFormElement,
    TitleField: TitleFieldFormElement,
    SubtitleField: SubtitleFieldFormElement,
    ParagraphField: ParagraphFieldFormElement,
    SeparatorField: SeparatorFieldFormElement,
    SpacerField: SpacerFieldFormElement,
}

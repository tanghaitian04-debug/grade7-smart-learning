import type icons from '../components/icons.json'

type SubjectMark = {icon:keyof typeof icons, symbol:string}
export const marks: Record<string, SubjectMark> = {
  chinese: {icon:'feather', symbol:'文'},
  math: {icon:'ruler', symbol:'π'},
  english: {icon:'languages', symbol:'Aa'},
  history: {icon:'landmark', symbol:'史'},
  geo: {icon:'globe', symbol:'地'},
  bio: {icon:'sprout', symbol:'生'},
  civics: {icon:'scale', symbol:'法'}
}

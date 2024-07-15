import { toLower } from 'lodash-es'
import titleCase from './titleCase.js'

export default function getTagsFilter(tags) {
  if (tags.includes('|')) {
    return { $in: tags.split('|').map(toLower) }
  }

  return { $all: tags.split(',').map(toLower) }
}

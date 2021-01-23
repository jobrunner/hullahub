export type HashTable<T> = {[index: string]: T}
export type FilteredResponse = HashTable<string> | undefined
export type SortedResponse = HashTable<string> | undefined
export type LimitedResponse = {offset: number, rowCount: number} | undefined
export type SetResponse = HashTable<string> | undefined
export type QueryParamBindable<T> = {clause: string, values: Array<T>}
export type DataItemBase<T> = {record: T}
export type DataCollectionBase<T> = {records: T[], meta: {records: number, of: number}}
export type DataItem<T> = DataItemBase<T>
export type DataCollection<T> = DataCollectionBase<T>

export const parseOrderBy = (sortDescriptor: string, sortWhiteList: Array<string>): SortedResponse => {
    if (sortDescriptor == undefined) {
        return undefined
    }

    let sortOrderClauses: HashTable<string> = {}
    sortDescriptor
        .split(",")
        .map(item => { return item.trim() })
        .forEach(item => {
            let key, val
            let firstCharacter = item[0]
            switch (firstCharacter) {
              case "-":
                key = `${item.slice(1, item.length)}`
                val = "DESC"
                break
              case "+":
                key = `${item.slice(1, item.length)}`
                val = "ASC"
                break
              default:
                key = `${item}`
                val = "ASC"
                break
            }
            if (sortWhiteList.includes(key)) {
                sortOrderClauses[key] = val
            }
        })
    return sortOrderClauses == {} ? undefined : sortOrderClauses
}

export const parseFilters = (filterDescriptor: HashTable<string>, 
                             fieldWhiteList: Array<string>): FilteredResponse => {
    let where: FilteredResponse = {}
    // var clauses: Array<string> = []
    // var values: Array<string> = []

    for (let key in filterDescriptor) {
        if (filterDescriptor.hasOwnProperty(key) && fieldWhiteList.includes(key)) {
            where[key] = filterDescriptor[key] 
            // clauses.push(` ${key} = ?`)
            // values.push(filterDescriptor[key])
        }
    }
    return where == {} ? undefined : where
}

// parameter: page=<page number (1 based index)>,<records per page>
export const parseLimiter = (limitDescriptor: string): LimitedResponse => {
    if (limitDescriptor == undefined) {
        return undefined
    }

    const limitParams: Array<number> = limitDescriptor.split(",").map(item => { return parseInt(item) })
    const pageNumber = limitParams[0] as number
    const pageSize = limitParams[1] as number

    return {offset: (pageNumber - 1) * pageSize, rowCount: pageSize}
}

export const parseSet = (setDescriptor: HashTable<string>, 
                         fieldWhiteList: Array<string>): SetResponse => {
    let set: SetResponse = {}
    // var clauses: Array<string> = []
    // var values: Array<string> = []

    for (let key in setDescriptor) {
        if (setDescriptor.hasOwnProperty(key) && fieldWhiteList.includes(key)) {
            set[key] = setDescriptor[key] 
            // clauses.push(` ${key} = ?`)
            // values.push(setDescriptor[key])
        }
    }
    return set == {} ? undefined : set
}

import { connectionPool } from "./mysql"
import { RowDataPacket } from "mysql2"
import { HashTable, 
         DataCollection, 
         QueryParamBindable } from "./query"
import * as models from "../models"

export type User = RowDataPacket | models.User

export const filter = async (criterias: HashTable<string> = {}, 
                             order: HashTable<string> = {}, 
                             limit: HashTable<number> = {}): Promise<DataCollection<User>> => {
    return filterSearch(criterias, order, limit, false)
}

export const search = async (criterias: HashTable<string> = {}, 
                             order: HashTable<string> = {}, 
                             limit: HashTable<number> = {}): Promise<DataCollection<User>> => {
    return filterSearch(criterias, order, limit, true)
}

const filterSearch = async (criterias: HashTable<string>, 
                            order: HashTable<string>, 
                            limit: HashTable<number>, 
                            searchMode: boolean = false): Promise<DataCollection<User>> => {
    let sql = "SELECT SQL_CALC_FOUND_ROWS id,email,username,created_at,updated_at,group_id,status FROM user"
    let values: Array<any> = []

    const whereBindable = makeWhereBindables(criterias, searchMode)
    if (whereBindable) {
        sql = sql + " " + whereBindable.clause
        for (let key in whereBindable.values) {
            values.push(whereBindable.values[key])
        }
    }

    const orderByBindable = makeOrderByClause(order)
    if (orderByBindable) {
        sql = sql + " " + orderByBindable.clause
    }

    const limitBindable = makeLimitBindables(limit)
    if (limitBindable) {
        sql = sql + " " + limitBindable.clause
        for (let key in limitBindable.values) {
            values.push(limitBindable.values[key])
        }
    }
    const [rows] = await connectionPool.query<RowDataPacket[]>(sql, values)
    const [calcFoundRows] = await connectionPool.query<RowDataPacket[]>("SELECT FOUND_ROWS() AS calc_rows")

    if (!calcFoundRows) {
        return { records: [], meta: {records: 0, of: 0} }
    } 
    const of = calcFoundRows[0]['calc_rows']
    if (!rows) {
        return { records: [], meta: {records: 0, of: of} }
    }

    const collection: DataCollection<User> = { records: rows, meta: {records: rows.length, of: of} }
    return collection
}

const makeWhereBindables = (filter: HashTable<string>, searchMode: boolean = false): QueryParamBindable<string> | undefined => {
    if (!filter || Object.keys(filter).length === 0) {
        return undefined
    }

    let clauses: Array<string> = []
    let values: Array<string> = []

    const connectionLogic = (searchMode == false) ? "OR" : "AND"
    
    for (let key in filter) {
        clauses.push(` ${key} = ?`)
        values.push(filter[key])
    }

    let whereClause = ""

    if (clauses.length > 0) {
        whereClause = "WHERE" + clauses.join(` ${connectionLogic}`)
    }

    return {clause: whereClause, values: values}
}

const makeOrderByClause = (order: HashTable<string>): QueryParamBindable<string> | undefined => {
    if (!order || Object.keys(order).length === 0) {
        return undefined
    }

    let sortOrderClauses: Array<string> = []
    for (let key in order) {
        const val = order[key]
        sortOrderClauses.push(`${key} ${val}`)
    }
    const orderByClause = "ORDER BY " + sortOrderClauses.join(",")
    return {clause: orderByClause, values: []}
}

const makeLimitBindables = (limit: HashTable<number>): QueryParamBindable<number> | undefined => {
    if (!limit || Object.keys(limit).length === 0) {
        return undefined
    }

    return {
        clause: "LIMIT ?,?",
        values: [limit.offset, limit.rowCount]  
    }
}

export const create = async (user: models.User): Promise<void> => {
    const name = user.name
    const userId = user.id
    await connectionPool.query("INSERT INTO user SET ?", user)
    await connectionPool.query("INSERT INTO member SET user_id = ?, name = ?", [userId, name])
}

export const changeEmailRequest = async (userId: string): Promise<void> => {    
    // erzeuge ein change token für die Änderung der Email-Adresse mit einer begrenzten zeitlichen Gültigkeit
}

export const changePasswordRequest = async (userId: string): Promise<void> => {
    // erzeuge ein change token für die Änderung des Passworts mit einer begrenzten zeitlichen Gültigkeit
}
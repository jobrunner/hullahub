import { connectionPool } from "./mysql"
import { RowDataPacket } from "mysql2"
import { DataCollection } from "./query"
import * as models from "../models"

export type Group = RowDataPacket | models.Group

export const retrive = async (): Promise<DataCollection<Group>> => {
    let sql = "SELECT SQL_CALC_FOUND_ROWS id,name FROM `group`"
    let values: Array<any> = []

    const [rows] = await connectionPool.query<RowDataPacket[]>(sql, values)
    const [calcFoundRows] = await connectionPool.query<RowDataPacket[]>("SELECT FOUND_ROWS() AS calc_rows")

    if (!calcFoundRows) {
        return { records: [], meta: {records: 0, of: 0} }
    }
    const of = calcFoundRows[0]['calc_rows']
    if (!rows) {
        return { records: [], meta: {records: 0, of: of} }
    }

    const collection: DataCollection<Group> = { records: rows, meta: {records: rows.length, of: of} }

    return collection
}

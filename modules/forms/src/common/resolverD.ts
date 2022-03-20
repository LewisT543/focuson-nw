import { NameAnd, RestAction } from "@focuson/utils";
import { OneDataDD } from "./dataD";

export interface Schema {
  name: string
}
/** This is the meta data about a table (except for field names..those are declared elsewhere */
export interface DBTable {
  /** Which schema the database is in. For now we only support single schema worlds */
  schema: Schema;
  /** The physical name of the table */
  name: string,
  /** the business purpose of the table */
  description: string,
  /** Any important comments or notes about this*/
  notes: string,
  /** How we audit the file */
  audit: AuditDetails
}

export interface AuditDetails {
  restActions: RestAction[],
  by: string
}

export interface DBTableAndName {
  name: string;
  table: DBTable;
}
export function isDbTableAndName ( d: DBTableAndMaybeName ): d is DBTableAndName {
  // @ts-ignore
  return d && d.schema === undefined
}
export function isDBTable ( d: DBTableAndMaybeName ): d is DBTable {
  // @ts-ignore
  return d.schema !== undefined
}
export type DBTableAndMaybeName = DBTableAndName | DBTable

/** This is 'are you a resolver or a data. As we add more types than sql resolver, we'll need this */
export const isResolver = isSqlResolverD

export type ResolverD = SqlResolverD | 'not defined yet'

export interface SqlResolverD {
  get: SqlGetDetails;
}
export function isSqlResolverD ( r: ResolverD ): r is SqlResolverD {
  // @ts-ignore
  return r?.get !== undefined
}

export interface Where {
  ids: string[];
  other?: string[]
}


export interface AliasAndWhere {
  aliases: NameAnd<DBTableAndMaybeName>;
  where: Where;
}

export interface SqlGetDetails extends AliasAndWhere {
  type: 'sql';
  aliases: NameAnd<DBTableAndMaybeName>;
  where: Where;
  sql: GetSqlFromDataDDetails[]
}
export interface GetSqlFromDataDDetails extends AliasAndWhere {
  data: OneDataDD<any>;
  aliases: NameAnd<DBTableAndMaybeName>;
  where: Where
}
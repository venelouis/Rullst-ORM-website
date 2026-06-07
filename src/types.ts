/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Column {
  name: string;
  type: 'i32' | 'i64' | 'String' | 'bool' | 'f64' | 'NaiveDateTime' | 'Uuid';
  primaryKey: boolean;
  nullable: boolean;
  unique: boolean;
  defaultValue?: string;
}

export interface ModelSchema {
  id: string;
  name: string;
  tableName: string;
  columns: Column[];
  relations: {
    type: 'has_many' | 'belongs_to' | 'has_one';
    model: string;
    foreignKey: string;
  }[];
}

export interface QueryStep {
  type: 'select' | 'where' | 'orWhere' | 'whereIn' | 'whereNull' | 'orderBy' | 'limit' | 'offset' | 'cache' | 'join' | 'with';
  params: string[];
}

export interface DocSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  pages: {
    title: string;
    slug: string;
    content: string;
    codeSnippet?: string;
    language?: string;
  }[];
}

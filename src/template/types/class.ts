import { SyntaxKind } from 'typescript'

export interface DecoratorEntity extends Entity {
  name?: string
  identifier?: IdentifierEntity | CallExpressionEntity
  parameters?: Array<StringLiteralEntity>
}

export interface PropertyEntity extends Entity {
  decorators: Array<DecoratorEntity>
  identifiers: Array<IdentifierEntity>
}

export interface ClassEntity extends Entity {
  name?: string
  decorators: DecoratorEntity[]
  properties: PropertyEntity[]
}

export interface CallExpressionEntity extends Entity {
  identifier?: IdentifierEntity
  parameters?: Array<StringLiteralEntity>
}

export interface IdentifierEntity extends Entity {
  name: string
}

export interface StringLiteralEntity extends Entity {
  name: string
}

export interface ObjectLiteralEntity extends Entity {
  name: string
  keyAndValue: [IdentifierEntity, StringLiteralEntity, NumericLiteralEntity][]
}

export interface NumericLiteralEntity extends Entity {
  value: number
}

export interface Entity {
  kind: SyntaxKind
}

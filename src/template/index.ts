import * as fs from 'fs'
import * as ts from 'typescript'
import { SyntaxKind } from 'typescript'
import * as ent from 'src/template/types/class'
import { inspect } from 'util'

export function runTemplate() {
  const file = fs.readFileSync('src/template/a.tsblob', 'utf8')
  const node = ts.createSourceFile('a.tsblob', file, ts.ScriptTarget.ES2022)
  parseNode(node)
}
function parseNode(node: ts.Node) {
  node.forEachChild((c) => {
    parseNode(c)
  })

  // console.log(nodeKind)

  switch (node.kind) {
    case SyntaxKind.ClassDeclaration:
      return parseClassNode(node as ts.ClassDeclaration)
    // case SyntaxKind.Identifier:
    //   return parseIdentifierNode(node as ts.Identifier)
    // case SyntaxKind.PropertyDeclaration:
    //   return parsePropertyDeclaration(node as ts.PropertyDeclaration)
    // case SyntaxKind.Decorator:
    //   return parseDecoratorNode(node as ts.Decorator)
  }
}

function parseClassNode(node: ts.ClassDeclaration) {
  const name = node.name.text
  // console.log(node, name)
  const obj: ent.ClassEntity = {
    name,
    kind: node.kind,
    decorators: [],
    properties: [],
  }

  node.forEachChild((n) => {
    switch (n.kind) {
      case SyntaxKind.Decorator:
        obj.decorators.push(parseDecoratorNode(n as ts.Decorator))
        break
      case SyntaxKind.PropertyDeclaration:
        obj.properties.push(parsePropertyDeclaration(n as ts.PropertyDeclaration))
    }
  })

  logInspect(obj)

  return obj
}

function parseIdentifierNode(node: ts.Identifier): ent.IdentifierEntity {
  return {
    name: node.escapedText as string,
    kind: node.kind,
  }
}
function parseStringLiteralNode(node: ts.StringLiteral): ent.StringLiteralEntity {
  return {
    name: node.text,
    kind: node.kind,
  }
}
function parsePropertyDeclaration(node: ts.PropertyDeclaration) {
  const entity: ent.PropertyEntity = {
    decorators: [],
    identifiers: [],
    kind: node.kind,
  }
  node.forEachChild((n) => {
    switch (n.kind) {
      case SyntaxKind.Identifier:
        entity.identifiers.push(parseIdentifierNode(n as ts.Identifier))
        break
      case SyntaxKind.Decorator:
        entity.decorators.push(parseDecoratorNode(n as ts.Decorator))
    }
  })

  return entity
  // console.log('---PROPERTY---', node)
}

function parseFirstLiteralNode(node: ts.NumericLiteral): ent.NumericLiteralEntity {
  return {
    kind: node.kind,
    value: Number(node.text),
  }
}

function parseObjectLiteralExpression(node: ts.ObjectLiteralExpression) {
  const entity = {
    kind: node.kind,
    keyAndValue: [],
  } as ent.ObjectLiteralEntity

  node.forEachChild((p) => {
    const pair = []
    p.forEachChild((n) => {
      switch (n.kind) {
        case SyntaxKind.Identifier:
          pair.push(parseIdentifierNode(n as ts.Identifier))
          break
        case SyntaxKind.StringLiteral:
          pair.push(parseStringLiteralNode(n as ts.StringLiteral))
          break
        case SyntaxKind.FirstLiteralToken:
          pair.push(parseFirstLiteralNode(n as ts.NumericLiteral))
          break
        case SyntaxKind.ObjectLiteralExpression:
          pair.push(parseObjectLiteralExpression(n as ts.ObjectLiteralExpression))
          break
      }
    })

    entity.keyAndValue.push(...pair)
  })

  return entity
}

function parseDecoratorNode(node: ts.Decorator) {
  const entity = {} as ent.DecoratorEntity
  node.forEachChild((n) => {
    switch (n.kind) {
      case SyntaxKind.Identifier:
        entity.identifier = parseIdentifierNode(n as ts.Identifier)
        break
      case SyntaxKind.CallExpression:
        entity.identifier = parseCallExpression(n as ts.CallExpression)
    }
  })

  return entity
}

function parseCallExpression(node: ts.CallExpression) {
  const entity: ent.CallExpressionEntity = {
    kind: node.kind,
  }

  node.forEachChild((n) => {
    if (
      [SyntaxKind.StringLiteral, SyntaxKind.ObjectLiteralExpression].includes(n.kind) &&
      entity.parameters === undefined
    ) {
      entity.parameters = []
    }
    switch (n.kind) {
      case SyntaxKind.Identifier:
        entity.identifier = parseIdentifierNode(n as ts.Identifier)
        break
      case SyntaxKind.StringLiteral:
        entity.parameters.push(parseStringLiteralNode(n as ts.StringLiteral))
        break
      case SyntaxKind.ObjectLiteralExpression:
        entity.parameters.push(parseObjectLiteralExpression(n as ts.ObjectLiteralExpression))
    }
  })

  return entity
}

function kindOf(node: ts.Node) {
  const nodeKind = SyntaxKind[node.kind]
  console.log(nodeKind)
}

function logInspect(obj: unknown, depth: number = null) {
  console.log(inspect(obj, { depth: depth, colors: true }))
}

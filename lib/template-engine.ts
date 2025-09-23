type Vars = Record<string, any>

export function renderTemplate(input: string, vars: Vars): string {
  return input.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
    const value = getProp(vars, key)
    return value != null ? String(value) : ""
  })
}

function getProp(obj: any, path: string): any {
  return path.split(".").reduce((acc, part) => (acc && acc[part] != null ? acc[part] : undefined), obj)
}

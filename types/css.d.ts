declare module 'css' {
  interface Declaration {
      type: string;
      property: string;
      value: string;
  }

  interface Rule {
      type: string;
      selectors?: string[];
      declarations: Declaration[];
  }

  interface Stylesheet {
      stylesheet: {
          rules: Rule[];
      };
  }

  export function parse(css: string): Stylesheet;
  export function stringify(ast: Stylesheet, options?: { indent?: string }): string;
}
// ============== OGY module_2f2a0ab9 ==============

export type OgyCandyValueProperty_2f2a0ab9 = {
    name: string;
    value: OgyCandyValue_2f2a0ab9;
    immutable: boolean;
};

export type OgyCandyValue_2f2a0ab9 =
    | { Int: string } // ? bigint -> string
    | { Nat: string } // ? bigint -> string
    | { Empty: null }
    | { Nat16: number }
    | { Nat32: number }
    | { Nat64: string } // ? bigint -> string
    | { Blob: Array<number> }
    | { Bool: boolean }
    | { Int8: number }
    | { Nat8: number }
    | {
          Nats: /* cspell: disable-line */
          | {
                    thawed: Array<string>; // ? bigint -> string
                    frozen?: undefined;
                }
              | {
                    thawed?: undefined;
                    frozen: Array<string>; // ? bigint -> string
                };
      }
    | { Text: string }
    | {
          Bytes:
              | { thawed: Array<number>; frozen?: undefined }
              | { thawed?: undefined; frozen: Array<number> };
      }
    | { Int16: number }
    | { Int32: number }
    | { Int64: string } // ? bigint -> string
    | { Option: [] | [OgyCandyValue_2f2a0ab9] }
    | {
          Floats:
              | { thawed: Array<number>; frozen?: undefined }
              | { thawed?: undefined; frozen: Array<number> };
      }
    | { Float: number }
    | { Principal: string } // ? principal -> string
    | {
          Array:
              | { thawed: Array<OgyCandyValue_2f2a0ab9>; frozen?: undefined }
              | { thawed?: undefined; frozen: Array<OgyCandyValue_2f2a0ab9> };
      }
    | { Class: Array<OgyCandyValueProperty_2f2a0ab9> };

// ============== OGY module_47a7c018 ==============

export type OgyCandyValueProperty_47a7c018 = {
    name: string;
    value: OgyCandyValue_47a7c018;
    immutable: boolean;
};

export type OgyCandyValue_47a7c018 =
    | { Int: string } // ? bigint -> string
    | { Map: [OgyCandyValue_47a7c018, OgyCandyValue_47a7c018][] }
    | { Nat: string } // ? bigint -> string
    | { Set: OgyCandyValue_47a7c018[] }
    | { Nat16: number }
    | { Nat32: number }
    | { Nat64: string } // ? bigint -> string
    | { Blob: Array<number> }
    | { Bool: boolean }
    | { Int8: number }
    | { Ints: string[] } // ? bigint -> string
    | { Nat8: number }
    | { Nats: Array<string> } // ? bigint -> string /* cspell: disable-line */
    | { Text: string }
    | { Bytes: Array<number> }
    | { Int16: number }
    | { Int32: number }
    | { Int64: string } // ? bigint -> string
    | { Option: [] | [OgyCandyValue_47a7c018] }
    | { Floats: Array<number> }
    | { Float: number }
    | { Principal: string } // ? principal -> string
    | { Array: Array<OgyCandyValue_47a7c018> }
    | { Class: Array<OgyCandyValueProperty_47a7c018> };

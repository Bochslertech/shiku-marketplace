import { OgyCandyValue_2f2a0ab9, OgyCandyValue_47a7c018 } from '@/01_types/nft-standard/ogy-candy';
import { bigint2string } from '@/02_common/types/bigint';
import { principal2string } from '@/02_common/types/principal';
import { unwrapVariant2, unwrapVariantKey } from '@/02_common/types/variant';
import {
    CandyValue as CandidCandyValue_2f2a0ab9,
    Property as CandidCandyValueProperty_2f2a0ab9,
} from './module_2f2a0ab9/ogy_2f2a0ab9.did.d';
import {
    CandyShared as CandidCandyValue_47a7c018,
    PropertyShared as CandidCandyValueProperty_47a7c018,
} from './module_47a7c018/ogy_47a7c018.did.d';
import {
    CandyShared as CandidCandyValue_243d1642,
    PropertyShared as CandidCandyValueProperty_243d1642,
} from './module_243d1642/ogy_243d1642.did.d';

// ============== OGY module_2f2a0ab9 ==============

export const unwrapCandyValue_2f2a0ab9 = (
    value: CandidCandyValue_2f2a0ab9,
): OgyCandyValue_2f2a0ab9 => {
    const key = unwrapVariantKey(value);
    if (key === undefined) throw new Error('can not parse candy value');
    const v = value[key];
    switch (key) {
        case 'Int':
            return { [key]: bigint2string(v) }; // ? bigint -> string
        case 'Nat':
            return { [key]: bigint2string(v) }; // ? bigint -> string
        case 'Empty':
            return { [key]: v };
        case 'Nat16':
            return { [key]: v };
        case 'Nat32':
            return { [key]: v };
        case 'Nat64':
            return { [key]: bigint2string(v) }; // ? bigint -> string
        case 'Blob':
            return { [key]: v };
        case 'Bool':
            return { [key]: v };
        case 'Int8':
            return { [key]: v };
        case 'Nat8':
            return { [key]: v };
        case 'Nats' /* cspell: disable-line */:
            return {
                [key]: unwrapVariant2(
                    v,
                    [
                        'thawed',
                        (ns: bigint[]) => ns.map(bigint2string), // ? bigint -> string
                    ],
                    [
                        'frozen',
                        (ns: bigint[]) => ns.map(bigint2string), // ? bigint -> string
                    ],
                ) as any,
            };
        case 'Text':
            return { [key]: v };
        case 'Bytes':
            return { [key]: v };
        case 'Int16':
            return { [key]: v };
        case 'Int32':
            return { [key]: v };
        case 'Int64':
            return { [key]: bigint2string(v) }; // ? bigint -> string
        case 'Option':
            return { [key]: v.length ? [unwrapCandyValue_2f2a0ab9(v[0])] : [] };
        case 'Floats':
            return { [key]: v };
        case 'Float':
            return { [key]: v };
        case 'Principal':
            return { [key]: principal2string(v) }; // ? principal -> string
        case 'Array':
            return {
                [key]: unwrapVariant2(
                    v,
                    [
                        'thawed',
                        (vs: CandidCandyValue_2f2a0ab9[]) =>
                            vs.map((v) => unwrapCandyValue_2f2a0ab9(v)), // ? bigint -> string
                    ],
                    [
                        'frozen',
                        (vs: CandidCandyValue_2f2a0ab9[]) =>
                            vs.map((v) => unwrapCandyValue_2f2a0ab9(v)), // ? bigint -> string
                    ],
                ) as any,
            };
        case 'Class':
            return {
                [key]: v.map((p: CandidCandyValueProperty_2f2a0ab9) => ({
                    name: p.name,
                    value: unwrapCandyValue_2f2a0ab9(p.value),
                    immutable: p.immutable,
                })),
            };
    }
    throw new Error('can not parse candy value');
};

// ============== OGY module_47a7c018 ==============

export const unwrapCandyValue_47a7c018 = (
    value: CandidCandyValue_47a7c018,
): OgyCandyValue_47a7c018 => {
    const key = unwrapVariantKey(value);
    if (key === undefined) throw new Error('can not parse candy value');
    const v = value[key];
    switch (key) {
        case 'Int':
            return { [key]: bigint2string(v) }; // ? bigint -> string
        case 'Map':
            return {
                [key]: v.map((item: [CandidCandyValue_47a7c018, CandidCandyValue_47a7c018]) => [
                    unwrapCandyValue_47a7c018(item[0]),
                    unwrapCandyValue_47a7c018(item[1]),
                ]),
            };
        case 'Nat':
            return { [key]: bigint2string(v) }; // ? bigint -> string
        case 'Set':
            return { [key]: v.map(unwrapCandyValue_47a7c018) };
        case 'Nat16':
            return { [key]: v };
        case 'Nat32':
            return { [key]: v };
        case 'Nat64':
            return { [key]: bigint2string(v) }; // ? bigint -> string
        case 'Blob':
            return { [key]: v };
        case 'Bool':
            return { [key]: v };
        case 'Int8':
            return { [key]: v };
        case 'Ints':
            return { [key]: v.map(bigint2string) }; // ? bigint -> string
        case 'Nat8':
            return { [key]: v };
        case 'Nats' /* cspell: disable-line */:
            return {
                [key]: v.map(bigint2string), // ? bigint -> string
            };
        case 'Text':
            return { [key]: v };
        case 'Bytes':
            return { [key]: v };
        case 'Int16':
            return { [key]: v };
        case 'Int32':
            return { [key]: v };
        case 'Int64':
            return { [key]: bigint2string(v) }; // ? bigint -> string
        case 'Option':
            return { [key]: v.length ? [unwrapCandyValue_47a7c018(v[0])] : [] };
        case 'Floats':
            return { [key]: v };
        case 'Float':
            return { [key]: v };
        case 'Principal':
            return { [key]: principal2string(v) }; // ? principal -> string
        case 'Array':
            return { [key]: v.map(unwrapCandyValue_47a7c018) };
        case 'Class':
            return {
                [key]: v.map((p: CandidCandyValueProperty_47a7c018) => ({
                    name: p.name,
                    value: unwrapCandyValue_47a7c018(p.value),
                    immutable: p.immutable,
                })),
            };
    }
    throw new Error('can not parse candy value 47a7c018');
};

// ============== OGY module_243d1642 ==============

export const unwrapCandyValue_243d1642 = (
    value: CandidCandyValue_243d1642,
): OgyCandyValue_47a7c018 => {
    const key = unwrapVariantKey(value);
    if (key === undefined) throw new Error('can not parse candy value');
    const v = value[key];
    switch (key) {
        case 'Int':
            return { [key]: bigint2string(v) }; // ? bigint -> string
        case 'Map':
            return {
                [key]: v.map((item: [CandidCandyValue_47a7c018, CandidCandyValue_47a7c018]) => [
                    unwrapCandyValue_47a7c018(item[0]),
                    unwrapCandyValue_47a7c018(item[1]),
                ]),
            };
        case 'Nat':
            return { [key]: bigint2string(v) }; // ? bigint -> string
        case 'Set':
            return { [key]: v.map(unwrapCandyValue_47a7c018) };
        case 'Nat16':
            return { [key]: v };
        case 'Nat32':
            return { [key]: v };
        case 'Nat64':
            return { [key]: bigint2string(v) }; // ? bigint -> string
        case 'Blob':
            return { [key]: v };
        case 'Bool':
            return { [key]: v };
        case 'Int8':
            return { [key]: v };
        case 'Ints':
            return { [key]: v.map(bigint2string) }; // ? bigint -> string
        case 'Nat8':
            return { [key]: v };
        case 'Nats' /* cspell: disable-line */:
            return {
                [key]: v.map(bigint2string), // ? bigint -> string
            };
        case 'Text':
            return { [key]: v };
        case 'Bytes':
            return { [key]: v };
        case 'Int16':
            return { [key]: v };
        case 'Int32':
            return { [key]: v };
        case 'Int64':
            return { [key]: bigint2string(v) }; // ? bigint -> string
        case 'Option':
            return { [key]: v.length ? [unwrapCandyValue_47a7c018(v[0])] : [] };
        case 'Floats':
            return { [key]: v };
        case 'Float':
            return { [key]: v };
        case 'Principal':
            return { [key]: principal2string(v) }; // ? principal -> string
        case 'Array':
            return { [key]: v.map(unwrapCandyValue_47a7c018) };
        case 'Class':
            return {
                [key]: v.map((p: CandidCandyValueProperty_243d1642) => ({
                    name: p.name,
                    value: unwrapCandyValue_243d1642(p.value),
                    immutable: p.immutable,
                })),
            };
    }
    throw new Error('can not parse candy value 47a7c018');
};

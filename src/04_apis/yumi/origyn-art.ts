//  origyn art 的邮箱订阅
export const origynArtRegisterEmail = async (email: string): Promise<boolean> => {
    const r = await fetch(`https://connect.mailerlite.com/api/subscribers`, {
        method: 'POST',
        headers: [
            ['authority', 'connect.mailerlite.com'],
            [
                'authorization',
                'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiY2ExNTU5MWQ3ZWVhMDYwMDNmYzkxNWU3YjVmMzhhY2YwYWZhYzU4MjUwY2IwOTZmYmM4NjhmMWZjODdhNDVlYjRhZTI2NjU2ZGQ1NjNjMmUiLCJpYXQiOjE2Njk3MTE0MTguMTQzMDk0LCJuYmYiOjE2Njk3MTE0MTguMTQzMDk3LCJleHAiOjQ4MjUzODUwMTguMTM2NDU4LCJzdWIiOiIyNTQxNjciLCJzY29wZXMiOltdfQ.ELZ_hmefcAWYcMEIBYYH-wRm2G3jdf6UvPstTgKhhnNlCEyXDDUcbOQ9TyIQGqzelPsP82JMp38UC40qMUsB2mT2tPZuMJKE65cNoCb7AJo1bTNi-GJT_MAMu4UFLyTXWmkDLxTFDiukfTDXkmwVWKd4xzXgTxYqLcJDYn8iB93FUTwIcHm86u-b76FWyD-RcRApmAL9ibghaNUlKIJ50GH8ZrcMc5zp_L107Hedtcjw9LL1FFW_UCkuC6XOuW5ZJBYLMbzxxpWDAs66pJmW9J1tLlqMLKNHGlmQG532iq2IZSXzyxoTPZksoXVnRvv3mIBhxaW_Lke9ggxiitfYaui60KUJY2qDA5fJjmcZCROnBu26k65M39gXOWyJtK0tpwZ5oj5JlWpSa235Aa0_3nmX1nRlvuCcFgTY913jN7gaVzvWhfEkBhEKozOVeySZv89PSzf9DgoVHYM-sWtsCd2HD2B5uwgZ95TLf7F1fJG1e4rx-G_u9eCciTc2xK7dr6FqDmF8q_MI57G0gEhyY8xRfu2_BAXufFRxEBZe-lbFVyX3dxouEOKS25_P4fSNZZStZGjWDhyoa8l8FEHlGJ1TfrgbLtvEsw1Ab0AZzvUwKvpn_vI_2ez6TSTZIr3ZbEeHM5Hj82cmv6TY_cFFatRC-_eQogZTbOnA9XF2Lpc',
            ],
            ['Content-Type', 'application/json'],
            ['Origin', 'https://tppkg-ziaaa-aaaal-qatrq-cai.raw.ic0.app'],
            ['Referer', 'https://tppkg-ziaaa-aaaal-qatrq-cai.raw.ic0.app'],
        ],
        body: JSON.stringify({ email }),
    });
    const json = await r.json();
    console.debug(`🚀 ~ file: origyn art.ts:5 ~ origynArtRegisterEmail ~ r:`, r, json);
    return [200, 201].includes(r.status);
};

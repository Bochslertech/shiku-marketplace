#!/bin/bash
start_time=$(date +%H:%M:%S)
start_time_s=$(date +%s)

# ================ ↓↓↓↓↓ 实际脚本内容 ↓↓↓↓↓ ================

git checkout test
git pull
pnpm i

rm -rf dist

export NODE_OPTIONS='--max-old-space-size=12000'

npm run build:test # 普通打包
# npm run build:production:test # 正式打包

cp domains/ic-assets.json dist/.ic-assets.json
rm -rf dist/.well-known
mkdir dist/.well-known
cp domains/test/ic-domains dist/.well-known/ic-domains
cp domains/test/ii-alternative-origins dist/.well-known/ii-alternative-origins

# ? zc6lp-xyaaa-aaaah-aaneq-cai # 本配置替换的罐子 ID
# 内容使用代理
# /favicon/
sed -i '' 's#href="/favicon/#href="https://cdn.yumi.io?url=https%3A%2F%2Fzc6lp-xyaaa-aaaah-aaneq-cai.raw.icp0.io%2Ffavicon%2F#g' dist/index.html
# /css/
sed -i '' 's#href="/css/#href="https://cdn.yumi.io?url=https%3A%2F%2Fzc6lp-xyaaa-aaaah-aaneq-cai.raw.icp0.io%2Fcss%2F#g' dist/index.html
# /spacingjs.js
sed -i '' 's#src="/spacingjs.js"#src="https://cdn.yumi.io?url=https%3A%2F%2Fzc6lp-xyaaa-aaaah-aaneq-cai.raw.icp0.io%2Fspacingjs.js"#g' dist/index.html
# /assets/index-xxxxxxxx.js
sed -i '' 's#src="/assets/index-#src="https://cdn.yumi.io?url=https%3A%2F%2Fzc6lp-xyaaa-aaaah-aaneq-cai.raw.icp0.io%2Fassets%2Findex-#g' dist/index.html
# /assets/index-xxxxxxxx.css
sed -i '' 's#href="/assets/index-#href="https://cdn.yumi.io?url=https%3A%2F%2Fzc6lp-xyaaa-aaaah-aaneq-cai.raw.icp0.io%2Fassets%2Findex-#g' dist/index.html
# /assets/polyfills-legacy-xxxxxxxx.js
sed -i '' 's#src="/assets/polyfills-legacy-#src="https://cdn.yumi.io?url=https%3A%2F%2Fzc6lp-xyaaa-aaaah-aaneq-cai.raw.icp0.io%2Fassets%2Fpolyfills-legacy-#g' dist/index.html
# /assets/index-legacy-xxxxxxxx.js
sed -i '' 's#src="/assets/index-legacy-#src="https://cdn.yumi.io?url=https%3A%2F%2Fzc6lp-xyaaa-aaaah-aaneq-cai.raw.icp0.io%2Fassets%2Findex-legacy-#g' dist/index.html

# 备份打包代码
rm -rf dist/.DS_Store
mkdir dist-records-test
cp -rf dist dist-records-test/dist_$(date '+%Y-%m-%d_%H.%M.%S')

dfx deploy --network ic frontend-yumi-next-test

# ================ ↑↑↑↑↑ 实际脚本内容 ↑↑↑↑↑ ================

end_time=$(date +%H:%M:%S)
end_time_s=$(date +%s)
spend=$(($end_time_s - $start_time_s))
spend_min=$(($spend / 60))
echo ''
echo "$start_time -> $end_time" "Total: $spend seconds ($spend_min mins)"
echo ''

#!/bin/bash
start_time=$(date +%H:%M:%S)
start_time_s=$(date +%s)

# ================ ↓↓↓↓↓ 实际脚本内容 ↓↓↓↓↓ ================

rm -rf dist

export NODE_OPTIONS='--max-old-space-size=12000'

npm run build:production

cp domains/ic-assets.json dist/.ic-assets.json
rm -rf dist/.well-known
mkdir dist/.well-known
cp domains/prod/ic-domains dist/.well-known/ic-domains
cp domains/prod/ii-alternative-origins dist/.well-known/ii-alternative-origins

# ================ ↑↑↑↑↑ 实际脚本内容 ↑↑↑↑↑ ================

end_time=$(date +%H:%M:%S)
end_time_s=$(date +%s)
spend=$(($end_time_s - $start_time_s))
spend_min=$(($spend / 60))
echo ''
echo "$start_time -> $end_time" "Total: $spend seconds ($spend_min mins)"
echo ''

# ================ ↓↓↓↓↓ 启动本地服务 ↓↓↓↓↓ ================

serve -s dist -p 4000

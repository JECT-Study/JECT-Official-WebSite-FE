#!/usr/bin/env bash
# 배포 워크플로에서 SSH로 호출하며, 커밋 SHA와 실행 ID를 조합한 release ID를 인자로 전달받는다.
set -euo pipefail

RELEASE_ID="$1"
BASE=/srv/ject-www
RELEASE="$BASE/releases/$RELEASE_ID"
ARCHIVE="/tmp/www-$RELEASE_ID.tar.gz"
PREVIOUS="$(readlink -e "$BASE/current" || true)"

rollback() {
  echo "서비스 재시작 또는 헬스 체크에 실패해 이전 버전으로 되돌립니다." >&2
  if [ -n "$PREVIOUS" ] && [ -d "$PREVIOUS" ]; then
    sudo ln -sfn "$PREVIOUS" "$BASE/current"
    sudo systemctl restart ject-www
    sudo rm -rf "$RELEASE"
  fi
  exit 1
}

sudo mkdir -p "$RELEASE"
sudo tar -xzf "$ARCHIVE" -C "$RELEASE"
sudo chown -R ject:ject "$RELEASE"
rm -f "$ARCHIVE"

sudo ln -sfn "$RELEASE" "$BASE/current"
sudo systemctl restart ject-www || rollback

# 재시작 직후에는 Node 서버가 아직 포트를 열지 않았을 수 있으므로 응답할 때까지 재시도한다.
for _ in $(seq 1 10); do
  if curl -fsS --max-time 5 -o /dev/null http://127.0.0.1:3000/; then
    ls -1dt "$BASE"/releases/* | tail -n +6 | xargs -r sudo rm -rf
    echo "배포를 완료했습니다: $RELEASE_ID"
    exit 0
  fi
  sleep 3
done

rollback

@echo off
echo GitHubに更新をアップロード中...
git add .
git commit -m "ゲーム更新: %date% %time%"
git push origin main
echo 完了！
pause
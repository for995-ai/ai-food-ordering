# 食癒所｜AI 智能點餐系統

以模組化 AI 服務為概念的智能點餐系統，結合健康數據與 ESG 食材資訊提供餐點建議。

## Overview

專案探討如何以模組化的 AI 服務降低餐飲業的客服成本：
由系統依據使用者的健康狀態與偏好推薦餐點，並揭露食材的 ESG 履歷資訊
（碳足跡、產地來源、熱量），讓點餐同時具備健康與永續的判斷依據。

## Architecture

本專案包含兩個部分：

| 部分 | 內容 | 部署狀態 |
|---|---|---|
| Frontend | `index.html` — 點餐介面與互動流程 | GitHub Pages（見下方 Live Demo） |
| Backend | `main.py` — FastAPI 服務，提供 AI 推薦與 ESG 查詢 API | 原始碼包含於本倉庫；**尚未部署為線上服務** |

## Live Demo（Frontend Prototype）

https://for995-ai.github.io/ai-food-ordering/

**這是前端互動原型。** GitHub Pages 為靜態託管，無法執行 FastAPI 後端，
因此線上版本展示的是完整的點餐介面與使用流程，
AI 推薦與 ESG 查詢的後端運算並未在此環境中執行。

後端原始碼（`main.py`）完整保留於本倉庫，可於本機執行。

## Features

- 點餐介面與流程設計
- 健康數據輸入（心率、壓力程度）
- 依健康狀態產生餐點建議的流程設計
- ESG 食材資訊呈現（碳足跡、產地、熱量）

## Tech Stack

**Frontend**
- HTML / CSS / JavaScript（原生）

**Backend**
- Python
- FastAPI
- Pydantic

## Local Development

前端：直接以瀏覽器開啟 `index.html`，或

```bash
npx serve .
```

後端：

```bash
pip install fastapi uvicorn
uvicorn main:app --reload
```

後端啟動後提供：
- `POST /api/ai-recommend`
- `GET  /api/esg-info/{ingredient_id}`

## Project Context

競賽專案。作者負責系統發想與建置，以及資料整合與簡報製作。

## License

未指定授權條款。

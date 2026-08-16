from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="食癒所 - AI點餐系統 API")

# 模擬 ESG 食材身分證資料庫
esg_ingredients = {
    "beef": {"name": "在地履歷低脂牛", "carbon_footprint": "低碳排", "source": "台灣在地小農牧場", "calories": 250},
    "pork": {"name": "活力梅花豬", "carbon_footprint": "認證減碳", "source": "彰化優良養豬場", "calories": 280},
    "chicken": {"name": "舒康去骨雞腿", "carbon_footprint": "低碳排", "source": "產銷履歷黑羽土雞", "calories": 210},
    "vegetables": {"name": "季節有機時蔬盤", "carbon_footprint": "零碳足跡", "source": "苗栗在地有機蔬菜", "calories": 80}
}

class HealthData(BaseModel):
    heart_rate: int
    stress_level: str  # High, Medium, Low

class OrderItem(BaseModel):
    main_course: str
    soup_base: str
    staple: str

@app.get("/")
def read_root():
    return {"message": "歡迎來到食癒所 AI 點餐系統"}

# 1. AI 生理檢測與配餐推薦路由
@app.post("/api/ai-recommend")
def get_ai_recommend(data: HealthData):
    # 根據心率與壓力指數給予個人化個人鍋推薦
    if data.stress_level == "High" or data.heart_rate > 90:
        recommendation = {
            "soup": "溫補藥膳療癒鍋",
            "main": "vegetables",
            "advice": "檢測到您目前壓力偏高、心率較快，推薦富含抗氧化成分的有機時蔬與溫和藥膳湯底，幫您舒緩身心。"
        }
    else:
        recommendation = {
            "soup": "鮮乳高鈣個人鍋",
            "main": "beef",
            "advice": "您的生理狀態良好！推薦補充優質高蛋白的在地低脂牛與鮮乳湯底，維持整天活力。"
        }
    
    # 附帶 ESG 食材資訊
    main_info = esg_ingredients.get(recommendation["main"], {})
    return {
        "recommendation": recommendation,
        "esg_info": main_info
    }

# 2. 獲取 ESG 食材身分證詳情
@app.get("/api/esg-info/{ingredient_id}")
def get_esg_info(ingredient_id: str):
    if ingredient_id not in esg_ingredients:
        raise HTTPException(status_code=404, detail="找不到該食材資訊")
    return esg_ingredients[ingredient_id]

import { GoogleGenAI } from "@google/genai";
import { IndustryData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSmartAdvice(industry: IndustryData): Promise<string> {
  const prompt = `
    Industri: ${industry.namaPerusahaan}
    Kabupaten: ${industry.kabupaten}
    Skala: ${industry.mesin.skala}
    Kondisi: ${industry.kondisiSaatIni}
    Kendala: ${industry.kendala}
    Status Kepatuhan:
    - Tenaga Teknis: ${industry.compliance.tenagaTeknis}
    - Hak Akses RPBBI: ${industry.compliance.hakAksesRPBBI}
    - RKOPHH: ${industry.compliance.rkophh}
    - Dokumen Angkut: ${industry.compliance.dokumenAngkut}

    Berdasarkan data di atas, berikan 3 langkah pembinaan singkat (pembinaan industri hasil hutan) yang harus dilakukan oleh CDK (Cabang Dinas Kehutanan).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
          temperature: 0.7,
      }
    });
    return response.text || "Tidak ada rekomendasi saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Gagal mendapatkan saran AI.";
  }
}

export async function getStrategicDashboardAdvice(industries: IndustryData[]): Promise<string> {
  const summary = industries.map(ind => ({
    nama: ind.namaPerusahaan,
    kab: ind.kabupaten,
    compliance: ind.compliance,
    kondisi: ind.kondisiSaatIni
  }));

  const prompt = `
    Analisis data industri hasil hutan kayu berikut:
    ${JSON.stringify(summary.slice(0, 30))} ... (dan ${industries.length - 30} industri lainnya)

    Berdasarkan data tersebut, berikan analisis ringkas:
    1. Identifikasi masalah kepatuhan utama (Ganis, RPBBI, atau RKOPHH).
    2. Berikan 3 rekomendasi aksi strategis untuk CDK Wilayah Pacitan & Ponorogo bulan ini.
    3. Sebutkan 2-3 nama perusahaan spesifik yang harus segera dikunjungi berdasarkan status "Belum" mereka.

    Tulis dalam bahasa Indonesia yang profesional dan lugas.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.5,
      }
    });
    return response.text || "Belum ada analisis strategis tersedia.";
  } catch (error) {
    console.error("Strategic Analysis Error:", error);
    return "Gagal memuat analisis strategis AI.";
  }
}

import authApi from "./authApi";

export const getQuarters = async (stock) => {
  const response = await authApi.get(`indicators/quarterly/${stock}`);
  return response.data;
};

export const getHistoricalData = async (code) => {
  const response = await authApi.get(`indicators/daily/${code}`);
  return response.data;
};

export const getFundamentalsRatioData = async (code) => {
  const { data } = await authApi.get(`fundamentals/ratio-data/${code}`);
  return data;
};

export const getCandelStickData = async (symbol) => {
  let duration = 4;
  const response = await authApi.get(
    `history/candles-stick-history/${symbol}?duration=${duration}`
  );
  return response.data;
};

export const getPerformerData = async (lang, limit,index) => {
  const response = await authApi.get(
    `indicators/top-performer/${lang}/${index}?${limit && `limit=${limit}`}`
  );

  return response.data;
};

export const getResources = async (code) => {
  const response = await authApi.get(`fundamentals/${code}`);
  return response.data;
};

export const getTreeData = async () => {
  const response = await authApi.get(`indicators/tree-chart`);
  return response.data;
};

export const getYearlyData = async (code) => {
  const response = await authApi.get(`indicators/yearly-high-low/${code}`);
  return response.data;
};

export const getStockActionsData = async () => {
  const response = await authApi.get(`indicators/stock-actions`);
  return response.data;
};

export const getHistoryDataForFundamentals = async (code) => {
  const response = await authApi.get(`fundamentals/history-data/${code}`);
  return response.data;
};

export const getYearlyEPSRating = async (code) => {
  const response = await authApi.get(`fundamentals/yearly-eps-rating/${code}`);
  return response.data;
};

export const getIndustryStockRankData = async (industry) => {
  const response = await authApi.get(
    `/fundamentals/stocks-rank-in-industry?industry=${industry}`
  );
  return response.data;
};

export const getShariaCompliantsData = async (code)=>{
  const response = await authApi.get(`/fundamentals/sharia-compliant-stocks/${code}`);
  return response.data;
}


export const getDividends= async (code)=>{
  const response = await authApi.get(`/fundamentals/dividends/${code}`);
  return response.data;
}


export const getIndicatorsData = async (symbol,index) => {
  let duration = 500;
  const response = await authApi.get(
    `/fundamentals/aggs/ticker/${symbol}/index/${index}?duration=${duration}`
  );
  return response.data;
};

export const getIndexHistoricalData = async (symbol) => {
  let duration = 500;
  const response = await authApi.get(
    `/fundamentals/aggs/index/${symbol}?duration=${duration}`
  );
  return response.data;
};

export const uploadFinancialData = async (data,data_type) => {
  const response = await authApi.post(`/uploadfiles/financials/${data_type}`, data);
  return response.data;

}

export const deleteTicker = async (ticker) => {
  const response = await authApi.delete(`/uploadfiles/ticker/${ticker}`);
  return response;
}

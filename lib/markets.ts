// Shared config + types for the Markets section (client and API route).

export type RangeKey = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';

export interface MarketAsset {
    symbol: string; // what we show
    yahoo: string; // data-provider symbol (prices in AUD)
    name: string;
    group: 'ETF' | 'Crypto';
    blurb: string;
}

export const ASSETS: MarketAsset[] = [
    { symbol: 'IVV', yahoo: 'IVV.AX', name: 'iShares S&P 500 ETF', group: 'ETF', blurb: 'Tracks the S&P 500, 500 of the largest US companies.' },
    { symbol: 'A200', yahoo: 'A200.AX', name: 'Betashares Australia 200 ETF', group: 'ETF', blurb: 'Tracks the S&P/ASX 200, Australia’s biggest listed companies.' },
    { symbol: 'NDQ', yahoo: 'NDQ.AX', name: 'Betashares Nasdaq 100 ETF', group: 'ETF', blurb: 'Tracks the Nasdaq-100, large US tech and growth companies.' },
    { symbol: 'VEU', yahoo: 'VEU.AX', name: 'Vanguard All-World ex-US ETF', group: 'ETF', blurb: 'Developed and emerging markets outside the United States.' },
    { symbol: 'BTC', yahoo: 'BTC-AUD', name: 'Bitcoin', group: 'Crypto', blurb: 'The original crypto network, often called digital gold.' },
    { symbol: 'ETH', yahoo: 'ETH-AUD', name: 'Ethereum', group: 'Crypto', blurb: 'A programmable blockchain that powers smart contracts.' },
    { symbol: 'SOL', yahoo: 'SOL-AUD', name: 'Solana', group: 'Crypto', blurb: 'A high-speed blockchain built for apps and payments.' },
];

export const RANGE_KEYS: RangeKey[] = ['1D', '1W', '1M', '3M', '1Y', '5Y'];

export const RANGES: Record<RangeKey, { range: string; interval: string; label: string }> = {
    '1D': { range: '1d', interval: '5m', label: 'Today' },
    '1W': { range: '5d', interval: '30m', label: 'Past week' },
    '1M': { range: '1mo', interval: '60m', label: 'Past month' },
    '3M': { range: '3mo', interval: '1d', label: 'Past 3 months' },
    '1Y': { range: '1y', interval: '1d', label: 'Past year' },
    '5Y': { range: '5y', interval: '1wk', label: 'Past 5 years' },
};

export interface AssetSeries {
    symbol: string;
    price?: number;
    base?: number; // value the change is measured against
    currency?: string;
    points?: [number, number][]; // [unix seconds, close]
    error?: boolean;
}

export interface MarketsResponse {
    range: RangeKey;
    updated: number;
    assets: AssetSeries[];
}

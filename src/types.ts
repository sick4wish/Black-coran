export type CharacterType = 'core' | 'verb' | 'modifier' | 'direction' | 'particle' | 'radical';

export type CoreNature = 'physical' | 'abstract' | 'dual' | 'organic';
export type VerbNature = 'physical' | 'abstract' | 'bridge' | 'dual';

export interface LexiconItem {
  character: string;
  pinyin: string;
  translation: string;
  type: CharacterType;
  nature?: CoreNature | VerbNature;
  description?: string;
}

export type ValidationColor = 'VIOLET' | 'GOLD' | 'SCARLET';

export interface ValidationResult {
  color: ValidationColor;
  reason: string;
  pinyinList: string[];
  translations: string[];
  parsedTokens: LexiconItem[];
  narrativeEffect: string;
  medulaCost: number; // in transitions
  physicalDamage?: {
    severity: 'none' | 'leve' | 'moderado' | 'severo';
    effect: string;
  };
}

export type MedulaState = '充沛' | '旺' | '平稳' | '弱' | '枯竭' | '逆流';

export interface MedulaStateDetails {
  state: MedulaState;
  pinyin: string;
  sensation: string;
  narrativeModel: string;
  index: number; // 0 to 5 for transitions
}

export interface ConjurationHistoryItem {
  id: string;
  timestamp: string;
  inputString: string;
  tokens: string[];
  validation: ValidationResult;
  previousState: MedulaState;
  newState: MedulaState;
}

export interface PlayerStats {
  medulaIndex: number; // 0 (充沛) to 4 (枯竭). 5 is 逆流 (Backflow)
  scarletCount24h: number; // to trigger 逆流 if >= 4
  currentInjuries: string[];
  consecutiveVioletCount: number;
}

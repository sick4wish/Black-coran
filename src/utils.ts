import { LEXICON, VIOLET_FORMULAS, SCARLET_DAMAGES, SCARLET_DAMAGES as ScarletDamagesMap } from './data';
import { LexiconItem, ValidationResult, ValidationColor, MedulaState } from './types';

// Helper to look up a token in the lexicon (handles 1 or 2 character tokens)
export function findLexiconItem(char: string): LexiconItem | undefined {
  return LEXICON.find(item => item.character === char);
}

// Tokenize a raw string (handles both space-separated and tries to resolve continuous Chinese text)
export function tokenizeInput(input: string): string[] {
  // If user separated by spaces, honor that
  const spaceSplit = input.trim().split(/\s+/).filter(Boolean);
  if (spaceSplit.length > 0 && spaceSplit.some(t => t.length > 0)) {
    // Check if spaceSplit contains valid multi-character words or single characters
    return spaceSplit;
  }

  // Fallback: If no spaces are used, split into characters.
  // Note: Some lexicon items are 2 characters (like '加速', '時間', '重力', '能量').
  // We will do a greedy tokenization to find multi-character items first.
  const chars = Array.from(input.trim());
  const tokens: string[] = [];
  let i = 0;
  while (i < chars.length) {
    const twoChar = chars.slice(i, i + 2).join('');
    if (findLexiconItem(twoChar)) {
      tokens.push(twoChar);
      i += 2;
    } else {
      tokens.push(chars[i]);
      i += 1;
    }
  }
  return tokens;
}

export function validateSpell(tokens: string[]): ValidationResult {
  const parsedTokens: LexiconItem[] = [];
  const pinyinList: string[] = [];
  const translations: string[] = [];
  const unrecognized: string[] = [];

  // 1. Lexicon Check
  for (const token of tokens) {
    const item = findLexiconItem(token);
    if (item) {
      parsedTokens.push(item);
      pinyinList.push(item.pinyin);
      translations.push(item.translation);
    } else {
      unrecognized.push(token);
    }
  }

  // If there are unrecognized tokens, immediately Scarlet
  if (unrecognized.length > 0) {
    return {
      color: 'SCARLET',
      reason: `El grimorio rechaza tu conjuro. Contiene caracteres ajenos a la sabiduría del Qilin Negro: "${unrecognized.join(', ')}".`,
      pinyinList: tokens.map(() => '??'),
      translations: tokens.map(() => 'Desconocido'),
      parsedTokens: tokens.map(t => findLexiconItem(t) || { character: t, pinyin: '??', translation: 'Desconocido', type: 'particle' }),
      narrativeEffect: 'Los trazos de tinta flotante chisporrotean y explotan en ráfagas de ceniza negra antes de formar el conjuro.',
      medulaCost: 0,
      physicalDamage: {
        severity: 'leve',
        effect: 'Una sacudida incómoda recorre tu columna, dejándote un regusto amargo a hollín en la garganta.'
      }
    };
  }

  if (parsedTokens.length === 0) {
    return {
      color: 'SCARLET',
      reason: 'El conjuro está vacío. No hay tinta escrita en el aire.',
      pinyinList: [],
      translations: [],
      parsedTokens: [],
      narrativeEffect: 'Nada ocurre. Solo el silencio frío de Cauffen llena la sala.',
      medulaCost: 0
    };
  }

  // 2. Determine Cost Complexity (Based on Chars & Modifiers)
  const totalChars = tokens.reduce((acc, t) => acc + t.length, 0);
  const modifierCount = parsedTokens.filter(t => t.type === 'modifier').length;

  let baseCost = 1;
  let complexity: 'leve' | 'moderado' | 'severo' = 'leve';

  if (totalChars >= 5 || modifierCount > 1) {
    baseCost = 3;
    complexity = 'severo';
  } else if (totalChars >= 3 || modifierCount === 1) {
    baseCost = 2;
    complexity = 'moderado';
  } else {
    baseCost = 1;
    complexity = 'leve';
  }

  // Create type signature string for grammar checks
  // C = core, V = verb, M = modifier, D = direction, P = particle
  const typeStr = parsedTokens.map(t => {
    if (t.type === 'core') return 'C';
    if (t.type === 'verb') return 'V';
    if (t.type === 'modifier') return 'M';
    if (t.type === 'direction') return 'D';
    return 'P';
  }).join('');

  // 3. Syntax Rules (Ley de la Forma)
  // Let's define the valid patterns:
  // - Standard: C+ V+ M* D? (at least one core, one verb, optional modifiers, optional direction)
  // - Possessive: C P(之|的) C V M* D?
  // - Adverbial: (C)? M P(地) V M* D?
  // - Continuous: C P(著) V M* D? or C V P(著) M* D?

  let syntaxValid = false;
  let syntaxPatternName = '';

  const isStandard = /^C+V+M*D?$/.test(typeStr);
  const isPossessive = /^C+PC+V+M*D?$/.test(typeStr) && parsedTokens.some((t, idx) => t.type === 'particle' && (t.character === '之' || t.character === '的') && idx > 0 && parsedTokens[idx-1].type === 'core' && parsedTokens[idx+1].type === 'core');
  const isAdverbial = /^(C+)?MPV+M*D?$/.test(typeStr) && parsedTokens.some((t, idx) => t.type === 'particle' && t.character === '地' && idx > 0 && parsedTokens[idx-1].type === 'modifier');
  const isContinuous = (/^C+PV+M*D?$/.test(typeStr) || /^C+VP+M*D?$/.test(typeStr)) && parsedTokens.some(t => t.type === 'particle' && t.character === '著');

  if (isStandard) {
    syntaxValid = true;
    syntaxPatternName = 'Estándar';
  } else if (isPossessive) {
    syntaxValid = true;
    syntaxPatternName = 'Posesivo Clásico';
  } else if (isAdverbial) {
    syntaxValid = true;
    syntaxPatternName = 'Modificación Adverbial';
  } else if (isContinuous) {
    syntaxValid = true;
    syntaxPatternName = 'Acción Continua';
  }

  // Special cases for very simple 2-token spells
  if (!syntaxValid) {
    // If it's just Core + Verb (e.g. 思 感)
    if (typeStr === 'CV') {
      syntaxValid = true;
      syntaxPatternName = 'Estándar Simple';
    }
  }

  if (!syntaxValid) {
    // Syntactic collapse!
    const collapsedElement = getThematicElement(parsedTokens);
    const physicalDmg = getThematicDamage(collapsedElement, complexity);
    return {
      color: 'SCARLET',
      reason: `Sintaxis rota (Ley de la Forma: la tinta se enreda en el orden incorrecto). Patrón detectado: [${parsedTokens.map(t => t.type.toUpperCase()).join(' → ')}]. El orden obligatorio exige Núcleo antes que Verbo.`,
      pinyinList,
      translations,
      parsedTokens,
      narrativeEffect: `La magia colapsa con un chasquido agudo. Los caracteres se desdibujan en humo negro que muerde tu cuerpo.`,
      medulaCost: 0,
      physicalDamage: {
        severity: complexity,
        effect: physicalDmg
      }
    };
  }

  // 4. Compatibility Rules
  // Retrieve cores and verbs
  const cores = parsedTokens.filter(t => t.type === 'core');
  const verbs = parsedTokens.filter(t => t.type === 'verb');

  let compatibilityValid = true;
  let compatibilityReason = '';

  for (const core of cores) {
    for (const verb of verbs) {
      const coreNature = core.nature;
      const verbNature = verb.nature;

      // Dual core/verb is universally compatible
      if (coreNature === 'dual' || verbNature === 'dual') {
        continue;
      }

      if (coreNature === 'abstract') {
        // Abstract cores require abstract verbs OR a bridge verb in the sentence
        const hasBridge = verbs.some(v => v.nature === 'bridge');
        if (verbNature === 'physical' && !hasBridge) {
          compatibilityValid = false;
          compatibilityReason = `Intento de aplicar un verbo destructivo físico ("${verb.character}") a un núcleo puramente abstracto ("${core.character}") sin una partícula o verbo puente (como 傳 o 引). El pensamiento no se puede romper ni quemar físicamente.`;
        }
      } else if (coreNature === 'physical' || coreNature === 'organic') {
        // Physical cores require physical/organic verbs or bridge verbs. They cannot link to purely abstract verbs like '感' (feel).
        if (verbNature === 'abstract') {
          compatibilityValid = false;
          compatibilityReason = `Un núcleo puramente físico o corpóreo ("${core.character}") no puede enlazarse con un verbo puramente mental o abstracto ("${verb.character}"). No puedes sentir sensorialmente de forma abstracta a un elemento sin proyectarlo.`;
        }
      }
    }
  }

  if (!compatibilityValid) {
    const collapsedElement = getThematicElement(parsedTokens);
    const physicalDmg = getThematicDamage(collapsedElement, complexity);
    return {
      color: 'SCARLET',
      reason: `Violación de compatibilidad semántica: ${compatibilityReason}`,
      pinyinList,
      translations,
      parsedTokens,
      narrativeEffect: `La incompatibilidad de conceptos provoca un reflujo inmediato. Sientes cómo el Qilin Negro rechaza la incoherencia de tu grimorio.`,
      medulaCost: 0,
      physicalDamage: {
        severity: complexity,
        effect: physicalDmg
      }
    };
  }

  // 5. Formula Check (Juicio de los Tres Colores: VIOLET vs GOLD)
  const spellStr = tokens.join(' ');
  const exactViolet = VIOLET_FORMULAS[spellStr];

  if (exactViolet) {
    return {
      color: 'VIOLET',
      reason: `Fórmula Real predefinida del grimorio. Estructura gramatical "${syntaxPatternName}" impecable y armoniosa con las corrientes mágicas.`,
      pinyinList,
      translations,
      parsedTokens,
      narrativeEffect: exactViolet,
      medulaCost: baseCost
    };
  } else {
    // GOLD formula (grammatically valid but custom/unexplored)
    const coreWord = cores.map(c => c.translation).join(' y ');
    const verbWord = verbs.map(v => v.translation).join(' y ');
    const modWord = parsedTokens.filter(t => t.type === 'modifier').map(m => m.translation).join(', ');
    const dirWord = parsedTokens.filter(t => t.type === 'direction').map(d => d.translation).join(', ');

    let generatedDescription = `Invocas la esencia de ${coreWord} para ejecutar la acción de ${verbWord}`;
    if (modWord) generatedDescription += `, intensificado por ${modWord}`;
    if (dirWord) generatedDescription += `, proyectando el efecto en dirección ${dirWord}`;
    generatedDescription += `. El hechizo funciona con éxito, pero la corriente mágica es inédita: se siente un "tic" extraño y la energía requerida aumenta.`;

    return {
      color: 'GOLD',
      reason: `Combinación inédita pero válida (Gramática "${syntaxPatternName}" correcta, territorio inexplorado por Antonio). Cobra un peaje adicional de +1 transición de Médula.`,
      pinyinList,
      translations,
      parsedTokens,
      narrativeEffect: generatedDescription,
      medulaCost: baseCost + 1
    };
  }
}

// Identify the primary elemental theme of a spell to customize SCARLET damage
function getThematicElement(parsedTokens: LexiconItem[]): string {
  // Check for cores first
  const coreChars = parsedTokens.filter(t => t.type === 'core').map(t => t.character);
  if (coreChars.includes('火')) return '火';
  if (coreChars.includes('水') || coreChars.includes('冰')) return '水';
  if (coreChars.includes('風')) return '風';
  if (coreChars.includes('光')) return '光';
  if (coreChars.includes('土') || coreChars.includes('重力')) return '土';
  if (coreChars.includes('血')) return '血';
  if (coreChars.includes('骨')) return '骨';
  if (coreChars.includes('思') || coreChars.includes('意') || coreChars.includes('念') || coreChars.includes('魂')) return '思';

  // Check verbs if no core matches
  const verbChars = parsedTokens.filter(t => t.type === 'verb').map(t => t.character);
  if (verbChars.includes('燃') || verbChars.includes('爆')) return '火';
  if (verbChars.includes('凍')) return '水';

  return 'default';
}

function getThematicDamage(element: string, severity: 'leve' | 'moderado' | 'severo'): string {
  const dmg = SCARLET_DAMAGES[element] || SCARLET_DAMAGES['default'];
  return dmg[severity];
}

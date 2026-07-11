import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  RotateCcw, 
  Moon, 
  Coffee, 
  BookOpen, 
  Compass, 
  ShieldAlert, 
  Clock, 
  History, 
  HelpCircle, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Eye,
  Info,
  ChevronRight,
  Flame,
  CloudRain,
  Skull,
  Volume2,
  VolumeX,
  Star,
  Trash2,
  Plus,
  Smartphone,
  Download
} from 'lucide-react';
import { LEXICON, MEDULA_STATES, VIOLET_FORMULAS, RADICALS_DATA } from './data';
import { validateSpell, tokenizeInput, findLexiconItem } from './utils';
import { LexiconItem, ValidationResult, MedulaState, PlayerStats, ConjurationHistoryItem } from './types';
import { ParticleCanvas } from './components/ParticleCanvas';
import { 
  playFireSound, 
  playWaterSound, 
  playScarletSound, 
  playVioletSound, 
  playGoldSound, 
  playRestSound,
  setAudioMute,
  setAudioVolume,
  playAmbientMusicTrack,
  getCurrentTrackType
} from './audio';
import { GlyphGenerator } from './components/GlyphGenerator';

export default function App() {
  // 1. Core State
  const [inputText, setInputText] = useState<string>('火 發 強 前');
  const [selectedTokens, setSelectedTokens] = useState<string[]>(['火', '發', '強', '前']);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  
  // Audio Controls State
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const saved = localStorage.getItem('qilin_muted');
    return saved === 'true';
  });
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('qilin_volume');
    return saved ? parseFloat(saved) : 0.5;
  });
  const [ambientMusicTrack, setAmbientMusicTrack] = useState<'fight' | 'hexing' | 'singular' | 'void'>(() => {
    const saved = localStorage.getItem('qilin_ambient_track');
    return (saved as 'fight' | 'hexing' | 'singular' | 'void') || 'singular';
  });

  // Sync ambient music track choice
  useEffect(() => {
    playAmbientMusicTrack(ambientMusicTrack);
    localStorage.setItem('qilin_ambient_track', ambientMusicTrack);
  }, [ambientMusicTrack]);

  // Visual effects feedback states
  const [flashType, setFlashType] = useState<'scarlet' | 'violet' | 'gold' | 'fire' | 'water' | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  
  // Contemplative Mode and Radical Filter States
  const [isContemplative, setIsContemplative] = useState<boolean>(false);
  const [selectedRadical, setSelectedRadical] = useState<string | null>(null);

  // Exit contemplative on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsContemplative(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Sync audio volumes
  useEffect(() => {
    setAudioMute(isMuted);
    localStorage.setItem('qilin_muted', String(isMuted));
  }, [isMuted]);

  useEffect(() => {
    setAudioVolume(volume);
    localStorage.setItem('qilin_volume', String(volume));
  }, [volume]);

  // Game metrics / stats
  const [stats, setStats] = useState<PlayerStats>(() => {
    const saved = localStorage.getItem('qilin_stats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      medulaIndex: 0, // 0 = 充沛 (Full)
      scarletCount24h: 0,
      currentInjuries: [],
      consecutiveVioletCount: 0
    };
  });

  const [history, setHistory] = useState<ConjurationHistoryItem[]>(() => {
    const saved = localStorage.getItem('qilin_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Active sub-tab for character library explorer
  const [activeTab, setActiveTab] = useState<'all' | 'core' | 'verb' | 'modifier' | 'direction' | 'particle'>('all');
  
  // Custom interactive help modal
  const [showHelp, setShowHelp] = useState<boolean>(false);
  
  // PWA & Android Installation state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [canInstallNative, setCanInstallNative] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallNative(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setCanInstallNative(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setCanInstallNative(false);
      setShowInstallModal(false);
    }
  };
  
  // Flavor ambient event around the castle
  const [ambientNote, setAmbientNote] = useState<string>(
    'El viento frío de la costa sopla contra las goteras de la sala principal. Huele a humo y lana mojada.'
  );

  // 2. Persist state
  const [favorites, setFavorites] = useState<{ id: string; name: string; tokens: string[]; timestamp: string }[]>(() => {
    const saved = localStorage.getItem('qilin_favorites');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      { id: 'fav-1', name: 'Aliento de Fuego YAN', tokens: ['火', '發', '強', '前'], timestamp: 'Grimorio' },
      { id: 'fav-2', name: 'Alquimia Terrenal', tokens: ['土', '生', '內', '定'], timestamp: 'Grimorio' },
      { id: 'fav-3', name: 'Invocación de Qilin Dorado', tokens: ['金', '召', '極', '外'], timestamp: 'Grimorio' }
    ];
  });
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('qilin_favorites_open');
    return saved === 'true';
  });
  const [newFavoriteName, setNewFavoriteName] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('qilin_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('qilin_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('qilin_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('qilin_favorites_open', String(isFavoritesOpen));
  }, [isFavoritesOpen]);

  // Sync selected tokens array to the manual input text for compatibility
  useEffect(() => {
    setInputText(selectedTokens.join(' '));
  }, [selectedTokens]);

  // Run initial validation on load
  useEffect(() => {
    if (selectedTokens.length > 0) {
      const res = validateSpell(selectedTokens);
      setValidation(res);
    } else {
      setValidation(null);
    }
  }, []);

  // 3. Ambient Note Generator (to increase immersion on success/failure)
  const generateAmbientNote = (color: string, parsedElements: string[]) => {
    const castleEvents = [
      'Se oye el murmullo de los siervos afuera: "El marqués está haciendo cosas raras otra vez..."',
      'Doña Beatriz de Montenegro (23 años) te observa con frialdad y recelo desde el ala norte.',
      'El mayordomo Mateo limpia la plata con manos temblorosas, evitando mirarte a los ojos.',
      'La vieja Quela (tu antigua nanny) suspira aliviada al verte erguido, murmurando bendiciones.',
      'La gotera de la sala principal salpica rítmicamente sobre las baldosas agrietadas.',
      'El retrato severo de Don Rodrigo de Montenegro te juzga desde su pesado marco dorado.',
      'En la pared cuelga el largo sable curvo familiar. Nadie se atreve a descolgarlo.',
      'Un rumor corre entre los guardias: dicen que el marqués ha fundado un "Culto de Oriente".'
    ];

    if (color === 'SCARLET') {
      const hasFire = parsedElements.includes('火') || parsedElements.includes('燃');
      const hasWater = parsedElements.includes('水') || parsedElements.includes('凍');
      if (hasFire) {
        return '¡Fallo crítico! El calor del fuego colapsado chamusca tus mangas y asusta a los perros Brutus y César que corren a esconderse.';
      }
      if (hasWater) {
        return '¡Colapso! Un escalofrío helado te recorre las botas. Mateo se persigna asustado al ver vaho saliendo de tu boca.';
      }
      return 'El conjuro se disuelve en una chispa caótica. Tu cuerpo absorbe el rebote de la corriente mágica.';
    } else if (color === 'VIOLET') {
      return `¡Hechizo Perfecto! La magia del grimorio fluye con suprema elegancia. Los retratos de la galería parecen contemplarte con un sordo asombro.`;
    } else {
      return 'La magia se manifiesta con un molesto latido errático. El mundo responde, pero sientes la resistencia de la materia inédita.';
    }
  };

  // 4. Action Handlers
  const handleTokenClick = (char: string) => {
    // Prevent duplicates in current drafting if selected, or just append
    setSelectedTokens(prev => [...prev, char]);
  };

  const handleBackspace = () => {
    setSelectedTokens(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setSelectedTokens([]);
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);
    const tokens = tokenizeInput(val);
    setSelectedTokens(tokens);
  };

  const handleConjurar = () => {
    if (selectedTokens.length === 0) return;

    // A. Perform validation
    const res = validateSpell(selectedTokens);
    
    // B. Calculate Medula State adjustments
    const currentIdx = stats.medulaIndex;
    let nextIdx = currentIdx;
    let newInjuries = [...stats.currentInjuries];
    let scarletAdd = stats.scarletCount24h;
    let consecutiveViolet = stats.consecutiveVioletCount;

    // Check if player is already in Kūjié (index 4 - Vacío) or if they hit the 4th Scarlet
    // This triggers Backflow (index 5 - 逆流)
    const isAlreadyKujie = currentIdx === 4;

    if (res.color === 'SCARLET') {
      scarletAdd += 1;
      consecutiveViolet = 0;
      
      // Accumulate physical injury
      if (res.physicalDamage && res.physicalDamage.effect) {
        const severityLabel = res.physicalDamage.severity.toUpperCase();
        const injuryDesc = `[${severityLabel}] ${res.physicalDamage.effect}`;
        // Avoid adding the exact same injury multiple times
        if (!newInjuries.includes(injuryDesc)) {
          newInjuries.push(injuryDesc);
        }
      }

      // Check if 4th scarlet to trigger backflow
      if (scarletAdd >= 4 || isAlreadyKujie) {
        nextIdx = 5; // 逆流 (Backflow)
      }
    } else {
      // Successful spells consume Medula transitions
      if (res.color === 'VIOLET') {
        consecutiveViolet += 1;
      } else {
        consecutiveViolet = 0;
      }

      // If already in Backflow, casting successful spell doesn't cure it instantly
      if (currentIdx === 5) {
        // remains in backflow until rest
        nextIdx = 5;
      } else {
        // subtract transitions (adds to index)
        const transitionCost = res.medulaCost;
        nextIdx = Math.min(4, currentIdx + transitionCost);
        
        // If they cast while in 枯竭, it causes Backflow
        if (currentIdx === 4) {
          nextIdx = 5; // 逆流
        }
      }
    }

    // Save previous state for history
    const prevMedulaState = MEDULA_STATES[currentIdx].state;
    const newMedulaState = MEDULA_STATES[nextIdx].state;

    // If backflow occurs, override validation text for narrative flavor
    if (nextIdx === 5) {
      res.narrativeEffect = `⚠️ ¡REFLUJO DE MÉDULA (逆流)! ${res.narrativeEffect} Los caracteres que escribiste se invierten en el aire. Un ardor hirviente te calcina los brazos y el hechizo se revierte brutalmente hacia ti. ¡La magia de la 瑪吉亞·楊 se descontrola!`;
    }

    // C. Update state
    setValidation(res);
    setStats({
      medulaIndex: nextIdx,
      scarletCount24h: scarletAdd,
      currentInjuries: newInjuries,
      consecutiveVioletCount: consecutiveViolet
    });

    // D. Generate ambient reaction
    const elementsInSpell = selectedTokens;
    setAmbientNote(generateAmbientNote(res.color, elementsInSpell));

    // E. Add to history
    const historyItem: ConjurationHistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      inputString: selectedTokens.join(' '),
      tokens: [...selectedTokens],
      validation: res,
      previousState: prevMedulaState,
      newState: newMedulaState
    };
    setHistory(prev => [historyItem, ...prev].slice(0, 50)); // limit to last 50

    // F. Dynamic Audio and Screen Flash effects
    const hasFire = selectedTokens.includes('火') || selectedTokens.includes('燃');
    const hasWater = selectedTokens.includes('水') || selectedTokens.includes('凍');

    if (res.color === 'SCARLET') {
      playScarletSound();
      setFlashType('scarlet');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      
      // Trigger explosive scarlet failure particles
      if (typeof window !== 'undefined' && window.triggerMagicParticles) {
        window.triggerMagicParticles(window.innerWidth / 2, window.innerHeight * 0.35, 'scarlet', 75);
      }
    } else {
      const screenX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
      const screenY = typeof window !== 'undefined' ? window.innerHeight * 0.35 : 300;

      if (res.color === 'VIOLET') {
        playVioletSound();
        setFlashType('violet');
        
        // Trigger elegant void particles
        if (typeof window !== 'undefined' && window.triggerMagicParticles) {
          window.triggerMagicParticles(screenX, screenY, 'void', 85);
        }

        if (hasFire) {
          setTimeout(() => {
            playFireSound();
            setFlashType('fire');
            if (typeof window !== 'undefined' && window.triggerMagicParticles) {
              window.triggerMagicParticles(screenX, screenY, 'fire', 45);
            }
          }, 350);
        } else if (hasWater) {
          setTimeout(() => {
            playWaterSound();
            setFlashType('water');
            if (typeof window !== 'undefined' && window.triggerMagicParticles) {
              window.triggerMagicParticles(screenX, screenY, 'water', 45);
            }
          }, 350);
        }
      } else if (res.color === 'GOLD') {
        playGoldSound();
        setFlashType('gold');

        // Trigger glittering gold particles
        if (typeof window !== 'undefined' && window.triggerMagicParticles) {
          window.triggerMagicParticles(screenX, screenY, 'gold', 75);
        }

        if (hasFire) {
          setTimeout(() => {
            playFireSound();
            setFlashType('fire');
            if (typeof window !== 'undefined' && window.triggerMagicParticles) {
              window.triggerMagicParticles(screenX, screenY, 'fire', 40);
            }
          }, 350);
        } else if (hasWater) {
          setTimeout(() => {
            playWaterSound();
            setFlashType('water');
            if (typeof window !== 'undefined' && window.triggerMagicParticles) {
              window.triggerMagicParticles(screenX, screenY, 'water', 40);
            }
          }, 350);
        }
      } else {
        // General spell sparks
        if (typeof window !== 'undefined' && window.triggerMagicParticles) {
          window.triggerMagicParticles(screenX, screenY, 'gold', 30);
        }
      }
    }

    // Reset flash overlay after 1 second
    setTimeout(() => {
      setFlashType(null);
    }, 1000);
  };

  // Rest recovery functions
  const handleRest = (hours: 8 | 6 | 1) => {
    let nextIdx = stats.medulaIndex;
    let note = '';
    let newInjuries = [...stats.currentInjuries];

    if (hours === 8) {
      // Full sleep: fills medula to 0, clears backflow, clears minor injuries
      nextIdx = 0;
      playRestSound();
      // Clear leve/moderado injuries (keep severe or clear all for game simplicity)
      newInjuries = newInjuries.filter(inj => inj.includes('[SEVERO]'));
      note = 'Duermes plácidamente durante 8 horas en el ala norte. Antonio amanece sintiendo un calor uniforme en los dientes y esternón. La Médula está llena.';
    } else if (hours === 6) {
      // 6h: recovers 3 transitions, clears backflow if index was 5
      playRestSound();
      if (nextIdx === 5) {
        nextIdx = 2; // normal
      } else {
        nextIdx = Math.max(0, nextIdx - 3);
      }
      note = 'Tomas un descanso profundo de 6 horas. Sientes el cuerpo suelto, la mente despejada y las manos firmes al despertar.';
    } else {
      // 1: meal or hot soup. Recovers 1 transition.
      if (nextIdx === 5) {
        note = 'Intentas comer un caldo caliente preparado por Quela, pero el ardor de la Médula rebelde te quema la garganta. Necesitas dormir.';
      } else {
        nextIdx = Math.max(0, nextIdx - 1);
        playRestSound();
        note = 'La vieja Quela te sirve un tazón de sopa de pescado caliente. El acto de comer repone un poco tus fuerzas vitales (+1 transición).';
      }
    }

    setStats(prev => ({
      ...prev,
      medulaIndex: nextIdx,
      scarletCount24h: 0, // Reset scarlet count on rest
      currentInjuries: newInjuries
    }));
    setAmbientNote(note);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('qilin_history');
  };

  const handleHealAllInjuries = () => {
    setStats(prev => ({
      ...prev,
      currentInjuries: []
    }));
    setAmbientNote('Utilizas cataplasmas y reposo para sanar todas las marcas físicas y quemaduras de tu cuerpo.');
  };

  const handleAddFavorite = () => {
    if (selectedTokens.length === 0) return;
    const nameToSave = newFavoriteName.trim() || `Glifo Hechizo ${favorites.length + 1}`;
    
    const newFav = {
      id: `fav-${Date.now()}`,
      name: nameToSave,
      tokens: [...selectedTokens],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setFavorites(prev => [newFav, ...prev]);
    setNewFavoriteName('');
    playGoldSound();
    setAmbientNote(`Has guardado el glifo "${nameToSave}" (${selectedTokens.join(' ')}) en tu grimorio de favoritos.`);
  };

  const handleDeleteFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const favToDelete = favorites.find(f => f.id === id);
    setFavorites(prev => prev.filter(f => f.id !== id));
    if (favToDelete) {
      setAmbientNote(`Has borrado el glifo "${favToDelete.name}" de tus favoritos.`);
    }
  };

  const handleInvokeFavorite = (tokens: string[], name: string) => {
    setSelectedTokens(tokens);
    playGoldSound();
    setAmbientNote(`Canalizas instantáneamente el glifo favorito "${name}" (${tokens.join(' ')}).`);
  };

  // 5. Categorize Lexicon Tab and Radical filtering
  const filteredLexicon = LEXICON.filter(item => {
    // Tab filter
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    if (!matchesTab) return false;

    // Radical filter
    if (!selectedRadical) return true;
    const radInfo = RADICALS_DATA.find(r => r.symbol === selectedRadical);
    if (!radInfo) return true;
    return radInfo.associatedCharacters.includes(item.character);
  });

  // Helper to color-code validation seals
  const getBadgeStyles = (color: string) => {
    switch (color) {
      case 'VIOLET':
        return 'bg-violet-950/80 text-violet-300 border-violet-500/50 shadow-violet-500/20';
      case 'GOLD':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-amber-500/20';
      case 'SCARLET':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-rose-500/20';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-600';
    }
  };

  // Helper to style pinyin elements with high-fidelity custom neon glow
  const getPinyinNeonClass = (type: string) => {
    switch (type) {
      case 'core':
        return 'text-sky-300 border-sky-950/50 [text-shadow:0_0_6px_#38bdf8,0_0_12px_rgba(56,189,248,0.4)]';
      case 'verb':
        return 'text-emerald-300 border-emerald-950/50 [text-shadow:0_0_6px_#34d399,0_0_12px_rgba(52,211,153,0.4)]';
      case 'modifier':
        return 'text-amber-300 border-amber-950/50 [text-shadow:0_0_6px_#fbbf24,0_0_12px_rgba(251,191,36,0.4)]';
      case 'direction':
        return 'text-fuchsia-300 border-fuchsia-950/50 [text-shadow:0_0_6px_#e879f9,0_0_12px_rgba(232,121,249,0.4)]';
      default:
        return 'text-zinc-400 border-zinc-900/50 [text-shadow:0_0_6px_#a1a1aa,0_0_12px_rgba(161,161,170,0.4)]';
    }
  };

  const currentMedulaDetails = MEDULA_STATES[stats.medulaIndex];

  return (
    <div className={`min-h-screen bg-[#0d0a09] text-zinc-100 font-sans selection:bg-amber-800 selection:text-white pb-12 relative overflow-hidden transition-all duration-300 ${isShaking ? 'animate-shake' : ''}`}>
      
      {/* Canvas-based particle system */}
      <ParticleCanvas />
      
      {/* Dynamic Ambient Full-screen Flash Overlays */}
      <AnimatePresence>
        {flashType === 'scarlet' && (
          <motion.div 
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 bg-rose-700/25 pointer-events-none z-50 mix-blend-color-burn"
          />
        )}
        {flashType === 'violet' && (
          <motion.div 
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 bg-violet-600/15 pointer-events-none z-50 mix-blend-color-dodge"
          />
        )}
        {flashType === 'gold' && (
          <motion.div 
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 bg-amber-500/15 pointer-events-none z-50 mix-blend-color-dodge"
          />
        )}
        {flashType === 'fire' && (
          <motion.div 
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 bg-orange-600/20 pointer-events-none z-50 mix-blend-screen"
          />
        )}
        {flashType === 'water' && (
          <motion.div 
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 bg-sky-500/20 pointer-events-none z-50 mix-blend-screen"
          />
        )}
      </AnimatePresence>

      {/* Visual background ambient details */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-amber-950/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-violet-950/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-amber-950/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        
        {/* Header banner */}
        <header className="border-b border-amber-900/30 pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-950/50 to-zinc-900 border border-amber-800/40 rounded-xl shadow-inner shadow-amber-900/20">
              <span className="text-3xl font-serif font-bold text-amber-500 block leading-none">黑</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-widest text-amber-200">黑基林</h1>
              <p className="text-xs sm:text-sm font-mono text-amber-600 tracking-wider">EL QILIN NEGRO — COMPENDIO Y VALIDADOR DE MAGIA YAN</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Audio Controller & Ambient Music Widget */}
            <div className="flex flex-wrap items-center gap-3 bg-zinc-950/80 border border-amber-900/20 rounded-lg p-2 text-xs text-amber-300">
              <div className="flex items-center gap-2">
                <button
                  id="btn-toggle-mute"
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-amber-100 transition-colors cursor-pointer focus:outline-none"
                  title={isMuted ? 'Activar sonido' : 'Silenciar'}
                >
                  {isMuted ? <VolumeX size={14} className="text-rose-500" /> : <Volume2 size={14} className="text-amber-500" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-14 sm:w-20 h-1 bg-amber-950 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
                  title="Volumen"
                />
                <span className="font-mono text-[9px] text-zinc-500 shrink-0 mr-1">{Math.round(volume * 100)}%</span>
              </div>

              <div className="hidden sm:block h-4 w-[1px] bg-zinc-800" />

              <div className="flex items-center gap-1">
                <span className="text-[8px] font-mono text-zinc-500 uppercase mr-1">Ambiente:</span>
                <button
                  id="btn-track-fight"
                  onClick={() => setAmbientMusicTrack('fight')}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-all cursor-pointer font-medium ${
                    ambientMusicTrack === 'fight' 
                      ? 'bg-amber-950/50 text-amber-300 border border-amber-500/30 font-bold shadow-sm shadow-amber-950' 
                      : 'hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Música de Pelea (fight1.mp3)"
                >
                  Pelea
                </button>
                <button
                  id="btn-track-hexing"
                  onClick={() => setAmbientMusicTrack('hexing')}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-all cursor-pointer font-medium ${
                    ambientMusicTrack === 'hexing' 
                      ? 'bg-purple-950/50 text-purple-300 border border-purple-500/30 font-bold shadow-sm shadow-purple-950' 
                      : 'hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Música de Hechicería (Hexing1.mp3)"
                >
                  Hechicería
                </button>
                <button
                  id="btn-track-singular"
                  onClick={() => setAmbientMusicTrack('singular')}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-all cursor-pointer font-medium ${
                    ambientMusicTrack === 'singular' 
                      ? 'bg-violet-950/50 text-violet-300 border border-violet-500/30 font-bold shadow-sm shadow-violet-950' 
                      : 'hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Música Singular (Procedural)"
                >
                  Singular
                </button>
                <button
                  id="btn-track-void"
                  onClick={() => setAmbientMusicTrack('void')}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-all cursor-pointer font-medium ${
                    ambientMusicTrack === 'void' 
                      ? 'bg-indigo-950/50 text-indigo-300 border border-indigo-500/30 font-bold shadow-sm shadow-indigo-950' 
                      : 'hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Música del Vacío (Procedural)"
                >
                  Vacío
                </button>
              </div>
            </div>

            <button 
              id="btn-help-open"
              onClick={() => setShowHelp(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/80 hover:bg-zinc-800/80 border border-amber-900/20 rounded-lg text-xs text-amber-300 transition-all cursor-pointer font-medium"
            >
              <HelpCircle size={14} />
              <span>Reglas y Leyes</span>
            </button>

            <button 
              id="btn-install-android"
              onClick={() => setShowInstallModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-950/40 to-amber-900/30 hover:from-amber-900/40 hover:to-amber-800/40 border border-amber-600/45 rounded-lg text-xs text-amber-300 transition-all cursor-pointer font-medium relative overflow-hidden group shadow-sm"
              title="Instalar Grimorio en Celular Android / Moto e40"
            >
              <Smartphone size={14} className="text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Instalar en Celular</span>
              {canInstallNative && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              )}
            </button>

            <button 
              id="btn-toggle-contemplative"
              onClick={() => setIsContemplative(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-500/30 rounded-lg text-xs text-amber-300 transition-all cursor-pointer font-medium"
              title="Activar Modo Contemplativo (Enfoque de Grimorio en Pantalla Completa)"
            >
              <Eye size={14} />
              <span>Modo Contemplativo</span>
            </button>

            <div className="px-3 py-1.5 bg-amber-950/20 border border-amber-900/30 rounded-lg text-xs text-amber-500 flex items-center gap-2">
              <Clock size={12} />
              <span className="font-mono">1576 — Castemare</span>
            </div>
          </div>
        </header>

        {/* Ambient Log Banner */}
        <div className="mb-8 p-4 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-900/50 border-l-4 border-amber-600 rounded-r-xl flex items-start gap-3">
          <div className="text-amber-500 mt-0.5 shrink-0"><Compass size={16} /></div>
          <div>
            <p className="text-xs font-mono text-amber-500/80 uppercase tracking-widest">Atmósfera de Cauffen</p>
            <p className="text-sm italic text-zinc-300 mt-0.5">{ambientNote}</p>
          </div>
        </div>

        {/* Main Grid: Left is Spell Builder & Lexicon, Right is Medula State & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: SPELL DRAFTING & DICTIONARY EXPLORER (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            
            {/* SPELL BUILDER INPUT */}
            <div className="bg-[#120f0e] border border-amber-900/30 rounded-2xl p-6 shadow-xl relative">
              <div className="absolute top-3 right-4 flex gap-1 text-zinc-500 text-xs font-mono">
                <span>[NÚCLEO + VERBO + MOD + DIR]</span>
              </div>
              
              <h2 className="text-sm font-serif font-bold text-amber-400 tracking-wider mb-4 flex items-center gap-2">
                <BookOpen size={16} />
                TRAZAR HECHIZO EN EL AIRE
              </h2>

              {/* Character Brush Preview Area */}
              <div className="bg-[#090706] rounded-xl p-4 border border-zinc-900 min-h-[100px] flex flex-wrap items-center justify-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.02),transparent_70%)] pointer-events-none" />
                
                {selectedTokens.length === 0 ? (
                  <span className="text-zinc-600 font-serif italic text-sm">Haz clic en los caracteres del lexicón inferior para escribir un conjuro...</span>
                ) : (
                  <AnimatePresence>
                    {selectedTokens.map((token, idx) => {
                      const item = findLexiconItem(token);
                      const isCore = item?.type === 'core';
                      const isVerb = item?.type === 'verb';
                      const isMod = item?.type === 'modifier';
                      const isDir = item?.type === 'direction';
                      const isPart = item?.type === 'particle';

                      let colorClass = 'text-zinc-400';
                      if (isCore) colorClass = 'text-sky-400 font-semibold';
                      if (isVerb) colorClass = 'text-emerald-400 font-semibold';
                      if (isMod) colorClass = 'text-amber-400';
                      if (isDir) colorClass = 'text-purple-400';
                      if (isPart) colorClass = 'text-zinc-500';

                      return (
                        <motion.div
                          key={`${token}-${idx}`}
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -10 }}
                          className="flex flex-col items-center bg-[#181412] border border-zinc-800 rounded-lg p-2.5 min-w-[64px]"
                        >
                          <span className={`text-2xl font-mono ${colorClass}`}>{token}</span>
                          <span className="text-[10px] font-mono text-zinc-500 mt-1">{item?.pinyin || '??'}</span>
                          <span className="text-[9px] text-zinc-500 text-center truncate max-w-[64px]">{item?.translation || '??'}</span>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>

              {/* Action Buttons underneath draft */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    id="spell-input-text"
                    value={inputText}
                    onChange={handleManualInputChange}
                    placeholder="Escribe caracteres separados por espacios..."
                    className="w-full bg-[#171412] text-zinc-100 border border-amber-900/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-600 font-mono"
                  />
                  {selectedTokens.length > 0 && (
                    <button
                      id="btn-backspace"
                      onClick={handleBackspace}
                      className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                      title="Borrar último"
                    >
                      <RotateCcw size={16} />
                    </button>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    id="btn-clear-spell"
                    onClick={handleClear}
                    disabled={selectedTokens.length === 0}
                    className="px-4 py-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer font-mono uppercase"
                  >
                    Limpiar
                  </button>

                  <button
                    id="btn-cast-spell"
                    onClick={handleConjurar}
                    disabled={selectedTokens.length === 0}
                    className="flex-grow sm:flex-grow-0 px-8 py-3 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 disabled:from-zinc-900 disabled:to-zinc-900 disabled:text-zinc-600 disabled:border-zinc-800 border border-amber-600/40 rounded-xl text-sm font-serif font-bold text-amber-100 shadow-lg hover:shadow-amber-900/20 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    <Sparkles size={16} />
                    Conjurar
                  </button>
                </div>
              </div>
            </div>

            {/* LEXICON LIBRARY EXPLORER */}
            <div className="bg-[#120f0e] border border-amber-900/30 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-4 mb-4 gap-3">
                <h2 className="text-md font-serif font-bold text-amber-200 tracking-wider flex items-center gap-2">
                  <Compass size={18} className="text-amber-500" />
                  LEXICÓN DEL GRIMORIO
                </h2>
                
                {/* Dictionary categories */}
                <div className="flex flex-wrap gap-1 bg-[#090706] p-1 border border-zinc-900 rounded-lg">
                  {[
                    { id: 'all', label: 'Todo' },
                    { id: 'core', label: 'Núcleos' },
                    { id: 'verb', label: 'Verbos' },
                    { id: 'modifier', label: 'Modificadores' },
                    { id: 'direction', label: 'Direcciones' },
                    { id: 'particle', label: 'Partículas' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                        activeTab === tab.id 
                          ? 'bg-amber-950 text-amber-300 font-semibold' 
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Radical Composition Filters */}
              <div className="mb-5 bg-[#090706]/60 rounded-xl p-3 border border-zinc-900/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-amber-500/80 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={11} className="text-amber-500 animate-pulse" />
                    Filtrar por Radicales de Poder (Composición)
                  </span>
                  {selectedRadical && (
                    <button
                      onClick={() => setSelectedRadical(null)}
                      className="text-[10px] font-mono text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      [Quitar filtro]
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {RADICALS_DATA.map(rad => {
                    const isSelected = selectedRadical === rad.symbol;
                    return (
                      <button
                        key={rad.symbol}
                        onClick={() => setSelectedRadical(isSelected ? null : rad.symbol)}
                        className={`group p-2 text-left rounded-lg border transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected 
                            ? 'bg-amber-950/40 border-amber-500/60 text-amber-200' 
                            : 'bg-zinc-950/40 border-zinc-900 hover:border-amber-950 text-zinc-400 hover:text-zinc-200'
                        }`}
                        title={`${rad.translation} — ${rad.description}`}
                      >
                        <span className={`text-xl font-mono shrink-0 transition-transform group-hover:scale-110 ${isSelected ? 'text-amber-400 font-bold' : 'text-zinc-500'}`}>
                          {rad.symbol.split(' ')[0]}
                        </span>
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-bold truncate leading-tight">{rad.translation.replace('Radical del ', '')}</p>
                          <p className="text-[8px] font-mono text-zinc-500 group-hover:text-zinc-400 truncate leading-none mt-0.5">{rad.associatedCharacters.length} caracteres</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid of Dictionary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredLexicon.map((item, index) => {
                  let badgeColor = 'bg-zinc-900 text-zinc-500';
                  let charColor = 'text-zinc-300';
                  
                  if (item.type === 'core') {
                    badgeColor = item.nature === 'abstract' ? 'bg-sky-950 text-sky-400 border border-sky-900/30' : 'bg-blue-950 text-blue-400 border border-blue-900/30';
                    charColor = 'text-sky-300 [text-shadow:0_0_8px_#38bdf8,0_0_15px_rgba(56,189,248,0.5)]';
                  } else if (item.type === 'verb') {
                    badgeColor = item.nature === 'bridge' ? 'bg-purple-950 text-purple-400 border border-purple-900/30' : 'bg-emerald-950 text-emerald-400 border border-emerald-900/30';
                    charColor = 'text-emerald-300 [text-shadow:0_0_8px_#34d399,0_0_15px_rgba(52,211,153,0.5)]';
                  } else if (item.type === 'modifier') {
                    badgeColor = 'bg-amber-950 text-amber-400 border border-amber-900/30';
                    charColor = 'text-amber-300 [text-shadow:0_0_8px_#fbbf24,0_0_15px_rgba(251,191,36,0.5)]';
                  } else if (item.type === 'direction') {
                    badgeColor = 'bg-fuchsia-950 text-fuchsia-400 border border-fuchsia-900/30';
                    charColor = 'text-fuchsia-300 [text-shadow:0_0_8px_#e879f9,0_0_15px_rgba(232,121,249,0.5)]';
                  } else if (item.type === 'particle') {
                    badgeColor = 'bg-zinc-900 text-zinc-400 border border-zinc-800/30';
                    charColor = 'text-zinc-300 [text-shadow:0_0_8px_#d4d4d8,0_0_15px_rgba(212,212,216,0.5)]';
                  }

                  return (
                    <button
                      key={`${item.character}-${index}`}
                      onClick={(e) => {
                        handleTokenClick(item.character);
                        if (typeof window !== 'undefined' && window.triggerMagicParticles) {
                          window.triggerMagicParticles(e.clientX, e.clientY, 'glyph-click', 12);
                        }
                      }}
                      onMouseEnter={(e) => {
                        if (typeof window !== 'undefined' && window.triggerMagicParticles) {
                          window.triggerMagicParticles(e.clientX, e.clientY, 'glyph-hover', 4);
                        }
                      }}
                      className="group p-3 bg-[#181412] hover:bg-[#1f1a18] border border-zinc-800/60 hover:border-amber-900/40 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between hover:scale-[1.02] shadow-sm relative overflow-hidden mystic-fog-container"
                    >
                      {/* Animated mystic fog backdrop */}
                      <div className="mystic-fog-overlay" />

                      {/* Glow on hover */}
                      <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-amber-500/0 group-hover:from-amber-500/5 transition-all rounded-tr-xl pointer-events-none" />

                      <div className="relative z-10 w-full h-full flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-1 w-full mb-1">
                          <span className={`text-xl font-mono ${charColor}`}>{item.character}</span>
                          <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-md bg-[#0a0807] border transition-all ${getPinyinNeonClass(item.type)}`}>
                            {item.pinyin}
                          </span>
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-xs font-semibold text-zinc-200 group-hover:text-amber-200 transition-colors leading-tight truncate">{item.translation}</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5 leading-normal line-clamp-2">{item.description}</p>
                        </div>

                        <div className="mt-2 pt-1.5 border-t border-zinc-900 flex justify-between items-center text-[8px] font-mono text-zinc-600">
                          <span>{item.type.toUpperCase()}</span>
                          {item.nature && <span className="italic">({item.nature})</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CHRONICLE / HISTORY OF CONJURATIONS */}
            <div className="bg-[#120f0e] border border-amber-900/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-4">
                <h2 className="text-sm font-serif font-bold text-amber-200 tracking-wider flex items-center gap-2">
                  <History size={16} className="text-amber-500" />
                  CRÓNICA DE CONJURACIONES
                </h2>
                {history.length > 0 && (
                  <button
                    id="btn-clear-history"
                    onClick={handleClearHistory}
                    className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer underline"
                  >
                    Borrar Crónica
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl text-zinc-600 text-xs italic">
                  Aún no has plasmado ninguna conjuración en las páginas de esta crónica.
                </div>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {history.map(item => (
                    <div 
                      key={item.id} 
                      className={`p-4 bg-zinc-950/80 border border-zinc-900/80 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-zinc-500">{item.timestamp}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 border rounded-full font-bold ${getBadgeStyles(item.validation.color)}`}>
                            {item.validation.color}
                          </span>
                        </div>
                        <p className="text-md font-mono font-bold tracking-wider text-amber-200">{item.inputString}</p>
                        <p className="text-xs text-zinc-400 line-clamp-2">{item.validation.narrativeEffect}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-zinc-900 text-xs font-mono">
                        <div className="text-right">
                          <p className="text-zinc-500 text-[9px] uppercase">Médula (髓)</p>
                          <p className="text-zinc-300">{item.previousState} → {item.newState}</p>
                        </div>
                        {item.validation.color === 'SCARLET' && item.validation.physicalDamage && (
                          <div className="text-rose-400 max-w-[150px] text-right">
                            <p className="text-rose-500/80 text-[9px] uppercase font-bold">Daño Físico</p>
                            <p className="text-[10px] truncate" title={item.validation.physicalDamage.effect}>{item.validation.physicalDamage.effect}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: MEDULA STATE, RESTING & VALIDATION RESULTS (4 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-8">
            
            {/* MEDULA STATUS (髓) PANEL */}
            <div className="bg-[#120f0e] border border-amber-900/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              
              <h2 className="text-sm font-serif font-bold text-amber-400 tracking-wider mb-6 flex items-center gap-2">
                <Flame size={16} className="text-amber-500" />
                ESTADO DE LA MÉDULA (髓)
              </h2>

              <div className="grid grid-cols-12 gap-4 items-center">
                
                {/* Visual Fluid Bottle indicator (Index 0 is full, Index 5 is backflow) */}
                <div className="col-span-4 flex flex-col items-center">
                  <div className="relative w-16 h-36 border-2 border-amber-800/40 rounded-b-3xl rounded-t-lg bg-[#080504] p-1 flex flex-col justify-end overflow-hidden shadow-inner shadow-amber-950/50">
                    
                    {/* Glowing glass reflections */}
                    <div className="absolute top-0 left-2 w-1.5 h-full bg-white/5 blur-[1px] pointer-events-none rounded-full" />
                    
                    {/* Liquid fill based on medulaIndex (0=100%, 4=15%, 5=backflow boiling) */}
                    <motion.div 
                      className={`w-full rounded-b-2xl relative ink-well-bubble ${
                        stats.medulaIndex === 5 
                          ? 'bg-rose-700 shadow-rose-900/60' 
                          : stats.medulaIndex >= 3 
                            ? 'bg-zinc-800 shadow-zinc-950/60' 
                            : 'bg-violet-900 shadow-violet-950/60'
                      }`}
                      style={{
                        height: stats.medulaIndex === 0 ? '100%' :
                                stats.medulaIndex === 1 ? '75%' :
                                stats.medulaIndex === 2 ? '50%' :
                                stats.medulaIndex === 3 ? '25%' :
                                stats.medulaIndex === 4 ? '10%' : '90%' // Boiling backflow
                      }}
                      animate={{ 
                        y: [0, -3, 0],
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: stats.medulaIndex === 5 ? 0.8 : 3, 
                        ease: "easeInOut" 
                      }}
                    >
                      {/* Liquid boiling/bubbling effect */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-white/20 blur-[0.5px]" />
                      {stats.medulaIndex === 5 && (
                        <div className="absolute top-1 left-0 w-full flex justify-around opacity-75">
                          <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce" />
                          <span className="w-1 h-1 bg-rose-300 rounded-full animate-ping" />
                          <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" />
                        </div>
                      )}
                    </motion.div>

                    {/* State text inside bottle */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-[10px] font-mono text-zinc-500 bg-black/60 px-1 rounded border border-zinc-900 font-bold">
                        {currentMedulaDetails.state}
                      </span>
                    </div>

                  </div>
                </div>

                {/* State symptoms & models */}
                <div className="col-span-8 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-600 uppercase tracking-widest">Nivel Mágico</span>
                    <h3 className="text-xl font-serif font-bold text-amber-200">
                      {currentMedulaDetails.state} 
                      <span className="text-xs font-mono font-medium text-zinc-500 ml-2">({currentMedulaDetails.pinyin})</span>
                    </h3>
                  </div>

                  <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl space-y-1.5">
                    <p className="text-[11px] font-mono text-amber-500 uppercase flex items-center gap-1">
                      <Info size={10} />
                      SENSACIÓN CORPORAL
                    </p>
                    <p className="text-xs text-zinc-300 italic leading-snug">
                      "{currentMedulaDetails.sensation}"
                    </p>
                  </div>
                </div>

              </div>

              {/* Narrative description */}
              <p className="text-xs text-zinc-400 mt-4 leading-relaxed border-t border-zinc-900 pt-3">
                {currentMedulaDetails.narrativeModel}
              </p>

              {/* Physical Injuries Tracker */}
              <div className="mt-4 pt-3 border-t border-zinc-900">
                <span className="text-[10px] font-mono text-rose-500 uppercase tracking-widest block mb-2">Marcas Físicas Acumuladas</span>
                {stats.currentInjuries.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">No tienes heridas ni quemaduras en el cuerpo joven de Antonio.</p>
                ) : (
                  <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                    {stats.currentInjuries.map((injury, i) => (
                      <div key={i} className="p-2 bg-rose-950/20 border border-rose-900/30 rounded-lg text-xs text-rose-300 flex items-start gap-1.5">
                        <ShieldAlert size={14} className="shrink-0 text-rose-500 mt-0.5" />
                        <span>{injury}</span>
                      </div>
                    ))}
                    <button
                      id="btn-heal-injuries"
                      onClick={handleHealAllInjuries}
                      className="w-full mt-2 p-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded text-[10px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                    >
                      Tratar heridas y marcas
                    </button>
                  </div>
                )}
              </div>

              {/* Resting and Recovery controls */}
              <div className="mt-6 pt-4 border-t border-amber-900/30">
                <span className="text-xs font-serif font-bold text-amber-300 block mb-3">RECUPERAR LA MÉDULA (髓)</span>
                
                <div className="grid grid-cols-3 gap-2">
                  <button
                    id="btn-rest-meal"
                    onClick={() => handleRest(1)}
                    className="p-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-amber-900/30 rounded-xl text-left transition-colors cursor-pointer"
                  >
                    <Coffee size={14} className="text-amber-500 mb-1" />
                    <p className="text-[10px] font-bold text-zinc-300 leading-tight">Sopa Caliente</p>
                    <p className="text-[9px] font-mono text-zinc-500 mt-0.5">+1 Transición</p>
                  </button>

                  <button
                    id="btn-rest-6h"
                    onClick={() => handleRest(6)}
                    className="p-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-amber-900/30 rounded-xl text-left transition-colors cursor-pointer"
                  >
                    <Moon size={14} className="text-purple-400 mb-1" />
                    <p className="text-[10px] font-bold text-zinc-300 leading-tight">Siesta 6h</p>
                    <p className="text-[9px] font-mono text-zinc-500 mt-0.5">+3 Transición</p>
                  </button>

                  <button
                    id="btn-rest-8h"
                    onClick={() => handleRest(8)}
                    className="p-2 bg-zinc-950 hover:bg-[#1a1412] border border-zinc-900 hover:border-amber-900/40 rounded-xl text-left transition-colors cursor-pointer"
                  >
                    <Moon size={14} className="text-amber-400 mb-1" />
                    <p className="text-[10px] font-bold text-zinc-300 leading-tight">Dormir 8h</p>
                    <p className="text-[9px] font-mono text-zinc-500 mt-0.5">Lleno (充沛)</p>
                  </button>
                </div>
              </div>

            </div>

            {/* RESULTS PANEL (EL JUICIO DE LOS TRES COLORES) */}
            {validation && (
              <div className="bg-[#120f0e] border border-amber-900/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-radial-gradient from-amber-500/5 to-transparent pointer-events-none" />
                
                <h2 className="text-sm font-serif font-bold text-amber-400 tracking-wider mb-4 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-amber-500" />
                  EL JUICIO DE LOS TRES COLORES
                </h2>

                <div className="space-y-4">
                  {/* Validation Badge */}
                  <div className={`p-4 border rounded-xl text-center shadow-md relative ${getBadgeStyles(validation.color)}`}>
                    <p className="text-[10px] font-mono tracking-widest uppercase">DICTAMEN DE CONJURACIÓN</p>
                    <h3 className="text-3xl font-serif font-black tracking-widest mt-1">{validation.color}</h3>
                    <p className="text-xs mt-2 italic leading-relaxed text-zinc-300 px-2">{validation.reason}</p>
                    {validation.color === 'VIOLET' && (
                      <div className="absolute top-2 right-2 text-violet-400" title="Hechizo Verdadero">
                        <Sparkles size={14} />
                      </div>
                    )}
                  </div>

                  {/* Character Breakdown */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Análisis Gramatical</span>
                    <div className="bg-[#090706] border border-zinc-900 rounded-xl p-3 divide-y divide-zinc-900">
                      {validation.parsedTokens.map((item, idx) => (
                        <div key={idx} className="py-2 first:pt-0 last:pb-0 flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-md font-mono font-bold text-amber-200">{item.character}</span>
                            <span className="text-[10px] font-mono text-zinc-500 italic">({item.pinyin})</span>
                          </div>
                          <div className="text-right">
                            <span className="text-zinc-300 font-semibold">{item.translation}</span>
                            <span className="text-[10px] text-zinc-500 font-mono ml-2 uppercase bg-zinc-950 px-1 rounded">
                              {item.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Narrative outcome */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Resolución Narrativa</span>
                    <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl">
                      <p className="text-sm italic text-zinc-200 leading-relaxed font-serif">
                        "{validation.narrativeEffect}"
                      </p>
                    </div>
                  </div>

                  {/* Stats details on spell cost */}
                  <div className="flex justify-between items-center p-3 bg-zinc-950 border border-zinc-900 rounded-xl text-xs font-mono">
                    <div>
                      <span className="text-[9px] text-zinc-500 uppercase">Costo en Médula</span>
                      <p className="text-zinc-200 font-bold">
                        {validation.color === 'SCARLET' ? '0 transiciones (colapso)' : `${validation.medulaCost} transiciones`}
                      </p>
                    </div>
                    {validation.color === 'SCARLET' && validation.physicalDamage && (
                      <div className="text-right">
                        <span className="text-rose-500/80 text-[9px] uppercase font-bold">Herida / Marcas</span>
                        <p className="text-rose-300 font-bold">{validation.physicalDamage.severity.toUpperCase()}</p>
                      </div>
                    )}
                    {validation.color === 'VIOLET' && (
                      <div className="text-right">
                        <span className="text-violet-400 text-[9px] uppercase font-bold">Racha Violet</span>
                        <p className="text-violet-300 font-bold">x{stats.consecutiveVioletCount}</p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* LIVE MAGIC GLYPH CANVAS TOOL */}
            <GlyphGenerator 
              tokens={selectedTokens} 
              validationColor={validation?.color || null} 
              medulaState={currentMedulaDetails?.state || '平稳'}
            />

          </div>

        </div>

        {/* LORE OVERVIEW FOOTER CARD */}
        <section className="mt-12 p-8 bg-[#120f0e] border border-amber-900/20 rounded-2xl shadow-xl">
          <h2 className="text-lg font-serif font-bold text-amber-200 mb-4 tracking-wider uppercase">
            BIBLIA DE VOCABULARIO — GUÍA DEL CASTER "黑基林"
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-zinc-400 leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-serif font-semibold text-amber-400 text-md">I. La Ley de la Forma</h3>
              <p>Todo hechizo válido sigue una estructura fija. Escribir fuera de este orden es invitar al fracaso — y el fracaso, en esta magia, muerde de vuelta en forma de quemaduras u otras aflicciones.</p>
              <p className="font-mono text-xs text-amber-600 bg-black/40 p-2 rounded border border-zinc-900">
                [ 核心 ] + [ 動詞 ] + [ 修飾 ]* + [ 方向 ]?
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-serif font-semibold text-amber-400 text-md">II. Regla de Compatibilidad</h3>
              <p>Un núcleo físico solo se enlaza naturalmente con verbos físicos de su naturaleza. Un núcleo abstracto exige un verbo abstracto (como 感) o una partícula puente (como 傳 o 引) para proyectarse físicamente.</p>
              <p className="italic text-xs text-zinc-500">Ejemplo: Intentar romper (破) un pensamiento (思) causa un colapso Scarlet, a menos que uses Transmitir (傳).</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-serif font-semibold text-amber-400 text-md">III. El Secreto del Marqués</h3>
              <p>Antonio (19 años) posee el grimorio 黑基林, indetectable para los siervos y la Iglesia de la Luz Eterna. Los testigos no ven los caracteres chinos flotar, pero sí presencian las llamas, los vientos y la magia desatada.</p>
              <p className="text-xs text-zinc-500">"El Qilin no te enseña el idioma. Te obliga a pensarlo."</p>
            </div>
          </div>
        </section>

      </div>

      {/* HELP AND LORE MODAL DIALOG */}
      <AnimatePresence>
        {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#120f0e] border border-amber-800/40 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative"
            >
              <button 
                id="btn-help-close"
                onClick={() => setShowHelp(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer text-xl font-bold font-mono"
              >
                ✕
              </button>

              <h2 className="text-2xl font-serif font-bold text-amber-200 mb-6 tracking-wide border-b border-amber-900/30 pb-3 uppercase flex items-center gap-2">
                <BookOpen className="text-amber-500" />
                Compendio de Conjuros del Qilin Negro
              </h2>

              <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
                <div>
                  <h3 className="font-serif font-bold text-amber-400 text-md mb-2">1. El Juicio de los Tres Colores</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-violet-950/30 border border-violet-900/40 rounded-xl space-y-1">
                      <p className="font-serif font-bold text-violet-400">● VIOLETA</p>
                      <p className="text-xs text-zinc-400">La secuencia es un término real chino y coherente. El hechizo fluye elegante y limpio. Consume el coste de energía base.</p>
                    </div>
                    <div className="p-3 bg-amber-950/30 border border-amber-900/40 rounded-xl space-y-1">
                      <p className="font-serif font-bold text-amber-400">● DORADO</p>
                      <p className="text-xs text-zinc-400">La gramática es perfecta pero inédita (inventada por ti). Funciona con éxito, pero cobra un peaje de +1 transición de energía.</p>
                    </div>
                    <div className="p-3 bg-rose-950/30 border border-rose-900/40 rounded-xl space-y-1">
                      <p className="font-serif font-bold text-rose-400">● ESCARLATA</p>
                      <p className="text-xs text-zinc-400">Sintaxis rota u orden incompatible. Consume 0 energía, pero la magia se rebela causando heridas físicas corporales.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-amber-400 text-md mb-2">2. Costes de Energía (Transiciones)</h3>
                  <p className="mb-2">La energía de la 髓 (Médula) no se mide numéricamente, sino por 6 estados discretos de salud descendente:</p>
                  <ul className="list-disc pl-5 space-y-1 font-mono text-xs text-zinc-400">
                    <li><strong className="text-amber-200">充沛 (Lleno)</strong>: Calor agradable en dientes y esternón.</li>
                    <li><strong className="text-amber-200">旺 (Próspero)</strong>: Cuerpo suelto, mente ágil.</li>
                    <li><strong className="text-amber-200">平稳 (Normal)</strong>: Tibieza estable de comida saciada.</li>
                    <li><strong className="text-amber-200">弱 (Débil)</strong>: Frío en la espalda y sabor de cobre.</li>
                    <li><strong className="text-amber-200">枯竭 (Vacío)</strong>: Dolor en huesos y manos temblorosas.</li>
                    <li><strong className="text-rose-400">逆流 (Rebelde / Backflow)</strong>: El frasco hierve. La magia te ataca directamente.</li>
                  </ul>
                  <p className="mt-3 text-xs">
                    Un hechizo <strong>Simple</strong> (2-3 chars, sin modificador) cuesta <strong>1 transición</strong>.<br />
                    Un hechizo <strong>Estándar</strong> (3-4 chars, 1 modificador) cuesta <strong>2 transiciones</strong>.<br />
                    Un hechizo <strong>Complejo</strong> (5+ chars) cuesta <strong>3 transiciones</strong>.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-amber-400 text-md mb-2">3. Fórmulas Violetas Conocidas para Probar:</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#090706] p-4 border border-zinc-900 rounded-xl text-amber-300">
                    <div>火 發 強 前 <span className="text-zinc-500">(Ráfaga Fuego)</span></div>
                    <div>水 護 環 <span className="text-zinc-500">(Escudo Agua)</span></div>
                    <div>思 感 <span className="text-zinc-500">(Sentir Mentes)</span></div>
                    <div>能量 發 加速 前 <span className="text-zinc-500">(Impulso Fuerza)</span></div>
                    <div>思 傳 破 <span className="text-zinc-500">(Fractura Mental)</span></div>
                    <div>重力 聚 下 <span className="text-zinc-500">(Presión Gravedad)</span></div>
                    <div>時間 隱 緩 <span className="text-zinc-500">(Ralentizar Tiempo)</span></div>
                    <div>血 癒 <span className="text-zinc-500">(Cerrar Herida)</span></div>
                  </div>
                </div>

                <div className="border-t border-amber-900/20 pt-4 flex justify-end">
                  <button
                    id="btn-help-modal-close"
                    onClick={() => setShowHelp(false)}
                    className="px-6 py-2 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-xs font-serif font-bold rounded-lg text-amber-100 transition-colors cursor-pointer uppercase"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ANDROID PWA/APK INSTALLATION MODAL DIALOG */}
      <AnimatePresence>
        {showInstallModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#120f0e] border-2 border-amber-800/40 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative border-double"
            >
              <button 
                id="btn-install-close"
                onClick={() => setShowInstallModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer text-xl font-bold font-mono"
              >
                ✕
              </button>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-200 mb-6 tracking-wide border-b border-amber-900/30 pb-3 uppercase flex items-center gap-2">
                <Smartphone className="text-amber-500" />
                Instalar Compendio en tu Celular (Android / Moto e40)
              </h2>

              <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
                
                {/* Visual PWA App representation */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-zinc-950/60 border border-amber-950/60 rounded-2xl">
                  <img 
                    src="/icon.png" 
                    alt="Logo El Qilin Negro" 
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl border border-amber-500/25 shadow-lg shadow-amber-950/40 shrink-0" 
                  />
                  <div className="text-center sm:text-left">
                    <h3 className="font-serif font-bold text-amber-300 text-base">El Qilin Negro</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Soporte total para Moto e40 y Android 11+</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">Standalone App</span>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-900/40">Offline Ready</span>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950/50 text-amber-400 border border-amber-900/40">Sin Anuncios</span>
                    </div>
                  </div>
                </div>

                {/* Method 1: Instant Native Install if browser supports it */}
                {canInstallNative && (
                  <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-3">
                    <div className="flex items-start gap-2">
                      <Sparkles className="text-amber-400 shrink-0 mt-0.5 animate-pulse" size={16} />
                      <div>
                        <h4 className="font-serif font-bold text-amber-300 text-sm">¡Instalación Directa Detectada!</h4>
                        <p className="text-xs text-zinc-400 mt-0.5">Tu navegador actual es compatible con la instalación directa de la aplicación.</p>
                      </div>
                    </div>
                    <button
                      onClick={handleNativeInstall}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 border border-amber-500/30 rounded-xl font-serif font-bold text-amber-100 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                    >
                      <Download size={14} />
                      INSTALAR GRIMORIO EN EL CELULAR NOW
                    </button>
                  </div>
                )}

                {/* Method 2: Manual Chrome instructions (Works everywhere on Android Chrome / Moto e40) */}
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-amber-400 text-md flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-950 border border-amber-800 text-[11px] text-amber-300 font-mono">1</span>
                    ¿Cómo instalarlo en tu Motorola Moto e40?
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Dado que los celulares Moto e40 ejecutan Android con Google Chrome, puedes instalar este grimorio como una App de escritorio nativa en menos de 10 segundos siguiendo estos simples pasos:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                    <div className="p-3 bg-zinc-950/60 border border-zinc-900 rounded-xl space-y-1">
                      <p className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">Paso 1</p>
                      <p className="text-xs text-zinc-400">Abre este sitio web en el navegador <strong>Google Chrome</strong> de tu teléfono Moto e40.</p>
                    </div>
                    <div className="p-3 bg-zinc-950/60 border border-zinc-900 rounded-xl space-y-1">
                      <p className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">Paso 2</p>
                      <p className="text-xs text-zinc-400">Toca el ícono de los <strong>tres puntos vertical ( ⋮ )</strong> en la barra de direcciones (esquina superior derecha).</p>
                    </div>
                    <div className="p-3 bg-zinc-950/60 border border-zinc-900 rounded-xl space-y-1">
                      <p className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">Paso 3</p>
                      <p className="text-xs text-zinc-400">Presiona <strong>"Instalar aplicación"</strong> o <strong>"Añadir a la pantalla de inicio"</strong> y confirma.</p>
                    </div>
                  </div>
                </div>

                {/* Benefits of Web App vs raw APK */}
                <div className="space-y-3">
                  <h3 className="font-serif font-bold text-amber-400 text-md flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-950 border border-amber-800 text-[11px] text-amber-300 font-mono">2</span>
                    ¿Por qué esto es mejor que un archivo .apk tradicional?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-zinc-900/30 border border-zinc-950 rounded-xl flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✔</span>
                      <div>
                        <strong className="text-zinc-200 block">Máxima Seguridad</strong>
                        <span className="text-zinc-400">No necesitas habilitar "Orígenes Desconocidos" en tu Moto e40. Cero riesgo de virus o malware.</span>
                      </div>
                    </div>
                    <div className="p-3 bg-zinc-900/30 border border-zinc-950 rounded-xl flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✔</span>
                      <div>
                        <strong className="text-zinc-200 block">Súper Liviana</strong>
                        <span className="text-zinc-400">Ocupa menos de 1 MB de almacenamiento. Los archivos APK pesan 50MB+ ralentizando tu teléfono.</span>
                      </div>
                    </div>
                    <div className="p-3 bg-zinc-900/30 border border-zinc-950 rounded-xl flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✔</span>
                      <div>
                        <strong className="text-zinc-200 block">Actualización Al Instante</strong>
                        <span className="text-zinc-400">Carga la última versión de los conjuros automáticamente, sin tener que descargar otra APK.</span>
                      </div>
                    </div>
                    <div className="p-3 bg-zinc-900/30 border border-zinc-950 rounded-xl flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✔</span>
                      <div>
                        <strong className="text-zinc-200 block">Sin Marcos ni Barras</strong>
                        <span className="text-zinc-400">Una vez instalada, la app se abre en pantalla completa eliminando el marco del navegador.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Literal APK Compilation Option (Bubblewrap & Capacitor) */}
                <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl space-y-2">
                  <h4 className="font-serif font-bold text-amber-500/90 text-xs uppercase tracking-wider">¿Deseas empaquetar un archivo .APK tú mismo?</h4>
                  <p className="text-xs text-zinc-400 leading-normal">
                    Si eres desarrollador o requieres estrictamente un instalador de extensión <strong>.apk</strong> para subirlo a la Play Store o enviarlo por WhatsApp, puedes empaquetar este mismo Grimorio en 2 minutos gratis usando una herramienta oficial de Google:
                  </p>
                  <ul className="list-decimal pl-5 text-[11px] text-zinc-500 space-y-1 font-mono">
                    <li>Entra en <a href="https://www.pwabuilder.com/" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">PWABuilder.com</a> (herramienta de empaquetado recomendada).</li>
                    <li>Pega este URL del Grimorio: <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded break-all">{typeof window !== 'undefined' ? window.location.origin : ''}</code></li>
                    <li>Haz clic en <strong>"Build"</strong> y descarga el paquete APK para Android listo para instalar de forma directa en tu Moto e40.</li>
                  </ul>
                </div>

                <div className="border-t border-amber-900/20 pt-4 flex justify-end">
                  <button
                    id="btn-install-modal-close"
                    onClick={() => setShowInstallModal(false)}
                    className="px-6 py-2 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-xs font-serif font-bold rounded-lg text-amber-100 transition-colors cursor-pointer uppercase"
                  >
                    Entendido
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN CONTEMPLATIVE MODE */}
      <AnimatePresence>
        {isContemplative && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#070504] z-50 overflow-y-auto flex flex-col items-center justify-start p-4 sm:p-8 custom-scrollbar"
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-[30%] h-[30%] bg-amber-950/15 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[35%] h-[35%] bg-violet-950/15 blur-[150px] rounded-full pointer-events-none" />

            {/* Close / Return Button (ESC) */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-6 z-10 shrink-0 border-b border-amber-900/15 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-serif text-amber-500 block">黑</span>
                <div>
                  <h3 className="text-sm font-serif font-bold text-amber-200 tracking-wider">EL GRIMORIO EN PANTALLA COMPLETA</h3>
                  <p className="text-[9px] font-mono text-amber-600/80 uppercase tracking-widest">Enfoque de Meditación y Conjuración Estricta</p>
                </div>
              </div>

              <button
                id="btn-close-contemplative"
                onClick={() => setIsContemplative(false)}
                className="flex items-center gap-2 px-3 py-1.5 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-500/30 rounded-lg text-xs text-amber-300 transition-all cursor-pointer font-medium"
              >
                <span>Cerrar Grimorio [ESC]</span>
                <XCircle size={14} />
              </button>
            </div>

            {/* Immersive Scroll Container */}
            <div className="w-full max-w-4xl bg-gradient-to-br from-[#181310] via-[#120f0d] to-[#0b0908] border-2 border-amber-950/60 shadow-2xl rounded-3xl p-6 sm:p-10 relative overflow-hidden my-auto flex flex-col gap-8 z-10 border-double">
              {/* Parchment aesthetic corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-800/40 rounded-tl-xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-800/40 rounded-tr-xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-800/40 rounded-bl-xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-800/40 rounded-br-xl pointer-events-none" />

              {/* Trazado (Spell Drafting Brush) Area */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={12} className="text-amber-500 animate-pulse" />
                    Trazado de Tinta Mágica (Área de Trazado)
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500">Orden: [NÚCLEO + VERBO + MOD + DIR]</span>
                </div>

                <div className="bg-[#070504] rounded-2xl p-6 sm:p-10 border border-amber-950/40 min-h-[160px] flex flex-wrap items-center justify-center gap-6 relative overflow-hidden shadow-inner">
                  {selectedTokens.length === 0 ? (
                    <span className="text-amber-800/60 font-serif italic text-base sm:text-lg text-center leading-relaxed">
                      El pergamino está en blanco.<br />Haz clic en los caracteres de la biblioteca inferior para escribir un conjuro...
                    </span>
                  ) : (
                    <AnimatePresence>
                      {selectedTokens.map((token, idx) => {
                        const item = findLexiconItem(token);
                        let colorClass = 'text-zinc-400';
                        let shadowGlow = 'rgba(255,255,255,0.02)';
                        if (item?.type === 'core') {
                          colorClass = 'text-sky-300 font-serif font-semibold';
                          shadowGlow = 'rgba(56,189,248,0.1)';
                        } else if (item?.type === 'verb') {
                          colorClass = 'text-emerald-300 font-serif font-semibold';
                          shadowGlow = 'rgba(52,211,153,0.1)';
                        } else if (item?.type === 'modifier') {
                          colorClass = 'text-amber-300 font-semibold';
                          shadowGlow = 'rgba(251,191,36,0.1)';
                        } else if (item?.type === 'direction') {
                          colorClass = 'text-purple-300';
                          shadowGlow = 'rgba(192,132,252,0.1)';
                        } else if (item?.type === 'particle') {
                          colorClass = 'text-zinc-500';
                          shadowGlow = 'rgba(113,113,122,0.05)';
                        }

                        return (
                          <motion.div
                            key={`contemplative-${token}-${idx}`}
                            initial={{ opacity: 0, scale: 0.8, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -15 }}
                            className="flex flex-col items-center bg-[#130f0c] border border-amber-950/30 rounded-xl p-4 min-w-[80px] shadow-lg transition-all hover:scale-105"
                            style={{ boxShadow: `0 8px 24px ${shadowGlow}` }}
                          >
                            <span className={`text-4xl sm:text-5xl font-mono ${colorClass} block mb-1 leading-none select-none`}>{token}</span>
                            <span className="text-xs font-mono text-amber-600/80 mt-1.5">{item?.pinyin || '??'}</span>
                            <span className="text-[10px] text-zinc-500 text-center truncate max-w-[80px] mt-0.5">{item?.translation || '??'}</span>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </div>

                {/* Spell Input Controls inside contemplative scroll */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={inputText}
                    onChange={handleManualInputChange}
                    placeholder="Escribe caracteres separados por espacios..."
                    className="flex-grow bg-[#090706] text-zinc-100 border border-amber-950/50 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-amber-600 font-mono text-center placeholder-amber-900/40"
                  />
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={handleClear}
                      disabled={selectedTokens.length === 0}
                      className="px-5 py-3.5 bg-zinc-950 hover:bg-zinc-900 border border-amber-950/30 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer font-mono uppercase"
                    >
                      Limpiar
                    </button>
                    <button
                      onClick={handleConjurar}
                      disabled={selectedTokens.length === 0}
                      className="flex-grow sm:flex-grow-0 px-10 py-3.5 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 disabled:from-zinc-900 disabled:to-zinc-900 disabled:text-zinc-600 disabled:border-zinc-800 border border-amber-600/40 rounded-xl text-sm font-serif font-bold text-amber-100 shadow-lg hover:shadow-amber-900/20 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest"
                    >
                      <Sparkles size={16} />
                      Conjurar
                    </button>
                  </div>
                </div>
              </div>

              {/* Poetic Outcome Result on nested aged parchment (only if validation is ready) */}
              {validation && (
                <motion.div
                  key={selectedTokens.join('-')}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0b0807] border border-amber-900/30 rounded-2xl p-5 sm:p-6 shadow-xl relative"
                >
                  <div className="absolute top-3 right-4 flex items-center gap-1.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getBadgeStyles(validation.color)}`}>
                      FLUX: {validation.color}
                    </span>
                  </div>

                  <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-3">Narrativa del Qilin</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-lg sm:text-xl font-serif font-bold text-amber-100 leading-relaxed italic">
                        "{validation.narrativeEffect}"
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-amber-950/30 text-xs">
                      <div>
                        <span className="text-zinc-500 font-mono block">Gramática & Compatibilidad:</span>
                        <span className="text-amber-300 font-mono font-medium">{validation.reason}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-mono block">Peaje de la Médula (髓):</span>
                        <span className="text-amber-500 font-mono font-semibold">
                          {validation.medulaCost === 0 ? '0 (Sin coste por Scarlet)' : `${validation.medulaCost} transición/es [Estado: ${currentMedulaDetails.state}]`}
                        </span>
                      </div>
                    </div>
                    
                    {validation.physicalDamage && (
                      <div className="p-3 bg-rose-950/20 border border-rose-900/20 rounded-lg text-xs text-rose-300">
                        <span className="font-bold text-rose-400 block uppercase tracking-wider mb-0.5">Efecto Secundario en el Cuerpo (SCARLET):</span>
                        {validation.physicalDamage.effect}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Minimalist Lexicon with Radical Filters inside Contemplative Scroll */}
              <div className="border-t border-amber-950/20 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                  <span className="text-xs font-serif font-bold text-amber-300 tracking-wider flex items-center gap-1.5">
                    <BookOpen size={14} className="text-amber-500" />
                    COMPENDIO DE CARACTERES
                  </span>

                  {/* Tiny tabs */}
                  <div className="flex flex-wrap gap-1 bg-[#090706] p-0.5 border border-amber-950/30 rounded-lg">
                    {[
                      { id: 'all', label: 'Todo' },
                      { id: 'core', label: 'Núcleos' },
                      { id: 'verb', label: 'Verbos' },
                      { id: 'modifier', label: 'Mods' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-2 py-0.5 text-[9px] font-medium rounded-md transition-all cursor-pointer ${
                          activeTab === tab.id 
                            ? 'bg-amber-950 text-amber-300 font-semibold' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Radical Filters */}
                <div className="flex flex-wrap gap-1.5 mb-4 bg-zinc-950/40 p-2.5 rounded-lg border border-amber-950/10">
                  {RADICALS_DATA.map(rad => {
                    const isSelected = selectedRadical === rad.symbol;
                    return (
                      <button
                        key={rad.symbol}
                        onClick={() => setSelectedRadical(isSelected ? null : rad.symbol)}
                        className={`px-2.5 py-1 rounded-md text-[10px] border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected 
                            ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 font-semibold' 
                            : 'bg-zinc-950/40 border-amber-950/20 text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        <span className="font-mono text-xs">{rad.symbol.split(' ')[0]}</span>
                        <span>{rad.translation.replace('Radical del ', '')}</span>
                      </button>
                    );
                  })}
                  {selectedRadical && (
                    <button
                      onClick={() => setSelectedRadical(null)}
                      className="px-2 py-1 text-[10px] text-rose-400 hover:text-rose-300 transition-colors font-mono cursor-pointer"
                    >
                      [Quitar filtro]
                    </button>
                  )}
                </div>

                {/* Grid of Characters */}
                <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredLexicon.map((item, index) => {
                    let charColor = 'text-zinc-300 [text-shadow:0_0_8px_#d4d4d8,0_0_15px_rgba(212,212,216,0.5)]';
                    if (item.type === 'core') charColor = 'text-sky-300 [text-shadow:0_0_8px_#38bdf8,0_0_15px_rgba(56,189,248,0.5)]';
                    else if (item.type === 'verb') charColor = 'text-emerald-300 [text-shadow:0_0_8px_#34d399,0_0_15px_rgba(52,211,153,0.5)]';
                    else if (item.type === 'modifier') charColor = 'text-amber-300 [text-shadow:0_0_8px_#fbbf24,0_0_15px_rgba(251,191,36,0.5)]';
                    else if (item.type === 'direction') charColor = 'text-fuchsia-300 [text-shadow:0_0_8px_#e879f9,0_0_15px_rgba(232,121,249,0.5)]';
                    else if (item.type === 'particle') charColor = 'text-zinc-400 [text-shadow:0_0_8px_#a1a1aa,0_0_15px_rgba(161,161,170,0.5)]';

                    return (
                      <button
                        key={`contemplative-lexicon-${item.character}-${index}`}
                        onClick={(e) => {
                          handleTokenClick(item.character);
                          if (typeof window !== 'undefined' && window.triggerMagicParticles) {
                            window.triggerMagicParticles(e.clientX, e.clientY, 'glyph-click', 8);
                          }
                        }}
                        onMouseEnter={(e) => {
                          if (typeof window !== 'undefined' && window.triggerMagicParticles) {
                            window.triggerMagicParticles(e.clientX, e.clientY, 'glyph-hover', 3);
                          }
                        }}
                        className="p-2 bg-[#0d0a09] hover:bg-[#15100e] border border-amber-950/20 hover:border-amber-500/30 rounded-lg text-center transition-all cursor-pointer flex flex-col items-center hover:scale-[1.03] relative overflow-hidden mystic-fog-container"
                        title={item.description}
                      >
                        {/* Animated mystic fog backdrop */}
                        <div className="mystic-fog-overlay" />

                        <div className="relative z-10 flex flex-col items-center w-full">
                          <span className={`text-[lg] font-mono ${charColor} block`}>{item.character}</span>
                          <span className={`text-[8px] font-mono uppercase mt-1 leading-none transition-all ${getPinyinNeonClass(item.type)}`}>{item.pinyin}</span>
                          <span className="text-[8px] text-zinc-500 truncate max-w-full mt-0.5 leading-none">{item.translation}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BARRA LATERAL COLAPSABLE DE GLIFOS FAVORITOS */}
      <div 
        className={`fixed right-0 top-0 h-full bg-[#0d0a09]/95 border-l border-amber-900/40 shadow-2xl z-40 transition-all duration-300 flex flex-col ${
          isFavoritesOpen ? 'w-80 translate-x-0' : 'w-80 translate-x-full'
        }`}
      >
        {/* Toggle Button attached to the left edge of the sidebar */}
        <button
          onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
          className="absolute left-[-42px] top-[140px] w-11 h-12 bg-[#0d0a09] border border-r-0 border-amber-900/40 rounded-l-xl flex flex-col items-center justify-center text-amber-400 hover:text-amber-200 transition-all shadow-lg cursor-pointer focus:outline-none"
          title={isFavoritesOpen ? 'Ocultar Glifos Hechizos' : 'Mostrar Glifos Hechizos'}
        >
          <Star size={16} className={`${isFavoritesOpen ? 'text-amber-500 fill-amber-500/35 animate-none' : 'text-amber-400 fill-amber-400/10 animate-pulse'}`} />
          <span className="text-[7px] font-mono uppercase tracking-tighter mt-1 font-bold">
            {isFavoritesOpen ? 'OCULTAR' : 'FAVS'}
          </span>
        </button>

        {/* Sidebar Content */}
        <div className="flex flex-col h-full pt-20 pb-6 px-5 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 border-b border-amber-900/30 pb-4 mb-5">
            <Star size={18} className="text-amber-500 fill-amber-500/20" />
            <div>
              <h2 className="text-sm font-serif font-bold text-amber-200 tracking-wider">GLIFOS FAVORITOS</h2>
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Secuencias rápidas de conjuro</p>
            </div>
          </div>

          {/* Save Current Spell Section */}
          <div className="mb-6 p-3.5 bg-[#15100e] border border-amber-950/40 rounded-xl">
            <h3 className="text-[10px] font-mono text-amber-500/80 uppercase tracking-widest mb-2.5">Grabar Hechizo Hecho</h3>
            {selectedTokens.length === 0 ? (
              <p className="text-[11px] text-zinc-500 italic leading-normal">
                El pergamino de trazado está vacío. Selecciona caracteres en el lexicón para poder guardarlos aquí.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="p-2 bg-[#0c0908] border border-zinc-900 rounded-lg flex flex-wrap gap-1.5 items-center justify-center min-h-[42px]">
                  {selectedTokens.map((t, i) => (
                    <span key={i} className="text-sm font-mono text-amber-300 font-bold">{t}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFavoriteName}
                    onChange={(e) => setNewFavoriteName(e.target.value)}
                    placeholder="Nombre del glifo..."
                    className="flex-grow bg-[#0c0908] text-zinc-200 border border-amber-950 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-600 font-serif"
                    maxLength={28}
                  />
                  <button
                    onClick={handleAddFavorite}
                    className="px-3 bg-amber-900/60 hover:bg-amber-800 border border-amber-700/40 rounded-lg text-amber-200 hover:text-amber-100 transition-colors cursor-pointer flex items-center justify-center"
                    title="Grabar Glifo"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Favorites List */}
          <div className="flex-grow space-y-3.5">
            <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Biblioteca de Hechizos</h3>
            {favorites.length === 0 ? (
              <p className="text-center py-6 border border-dashed border-zinc-900 rounded-xl text-zinc-600 text-xs italic">
                No tienes glifos guardados.
              </p>
            ) : (
              <div className="space-y-3">
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    onClick={() => handleInvokeFavorite(fav.tokens, fav.name)}
                    className="group p-3 bg-[#110d0c] hover:bg-[#191310] border border-zinc-900 hover:border-amber-950 rounded-xl transition-all cursor-pointer flex flex-col justify-between gap-2.5 relative overflow-hidden shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-serif font-bold text-amber-200 group-hover:text-amber-100 truncate transition-colors">
                          {fav.name}
                        </h4>
                        <span className="text-[8px] font-mono text-zinc-600 mt-0.5 block">{fav.timestamp}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteFavorite(fav.id, e)}
                        className="text-zinc-600 hover:text-rose-400 p-1 rounded-md hover:bg-zinc-950/60 transition-all cursor-pointer shrink-0"
                        title="Borrar de favoritos"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 p-1.5 bg-[#0a0807]/80 rounded-lg border border-zinc-900/50 justify-center">
                      {fav.tokens.map((token, tokenIdx) => {
                        const item = findLexiconItem(token);
                        let tokenColor = 'text-zinc-400';
                        if (item?.type === 'core') tokenColor = 'text-sky-400 font-bold';
                        else if (item?.type === 'verb') tokenColor = 'text-emerald-400 font-bold';
                        else if (item?.type === 'modifier') tokenColor = 'text-amber-400';
                        else if (item?.type === 'direction') tokenColor = 'text-purple-400';

                        return (
                          <div key={tokenIdx} className="flex flex-col items-center px-1">
                            <span className={`text-[13px] font-mono ${tokenColor}`}>{token}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

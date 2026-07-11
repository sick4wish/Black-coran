import { LexiconItem, MedulaStateDetails, ValidationColor } from './types';

export const LEXICON: LexiconItem[] = [
  // NÚCLEOS FÍSICOS
  { character: '火', pinyin: 'huǒ', translation: 'Fuego', type: 'core', nature: 'physical', description: 'La llama ardiente, el calor y la combustión pura.' },
  { character: '水', pinyin: 'shuǐ', translation: 'Agua', type: 'core', nature: 'physical', description: 'El flujo constante, la fluidez y la humedad templada.' },
  { character: '光', pinyin: 'guāng', translation: 'Luz', type: 'core', nature: 'physical', description: 'El destello cegador, la iluminación y la pureza visual.' },
  { character: '風', pinyin: 'fēng', translation: 'Viento', type: 'core', nature: 'physical', description: 'Las ráfagas costeras de Castemare, el aire en movimiento.' },
  { character: '土', pinyin: 'tǔ', translation: 'Tierra', type: 'core', nature: 'physical', description: 'La roca sólida, el suelo inerte y la barrera densa.' },
  { character: '冰', pinyin: 'bīng', translation: 'Hielo', type: 'core', nature: 'physical', description: 'La escarcha cortante, el frío rígido y la congelación.' },
  { character: '雷', pinyin: 'léi', translation: 'Trueno/Rayo', type: 'core', nature: 'physical', description: 'El sonido del trueno y el relámpago violento que quiebra el cielo.' },
  { character: '電', pinyin: 'diàn', translation: 'Electricidad', type: 'core', nature: 'physical', description: 'El rayo violento, la chispa azul y la corriente.' },
  { character: '岩', pinyin: 'yán', translation: 'Roca', type: 'core', nature: 'physical', description: 'Piedra montañosa sólida, riscos escarpados.' },
  { character: '金屬', pinyin: 'jīnshǔ', translation: 'Metal', type: 'core', nature: 'physical', description: 'El elemento metálico rígido, duro y conductor.' },
  { character: '木', pinyin: 'mù', translation: 'Madera', type: 'core', nature: 'physical', description: 'La materia vegetal sólida, las ramas, raíces y árboles de Castemare.' },
  { character: '煙', pinyin: 'yān', translation: 'Humo', type: 'core', nature: 'physical', description: 'La humareda gris derivada del fuego, asfixiante y densa.' },
  { character: '霧', pinyin: 'wù', translation: 'Niebla', type: 'core', nature: 'physical', description: 'La bruma salina de Castemare, suspendida entre el agua y el viento.' },
  { character: '塵', pinyin: 'chén', translation: 'Polvo', type: 'core', nature: 'physical', description: 'Las partículas finas de tierra que flotan en el aire.' },
  { character: '沙', pinyin: 'shā', translation: 'Arena', type: 'core', nature: 'physical', description: 'La arena de la costa de Cauffen, granulada e inestable.' },
  { character: '泥', pinyin: 'ní', translation: 'Barro/Lodo', type: 'core', nature: 'physical', description: 'La mezcla viscosa de tierra y agua, pegajosa y densa.' },
  { character: '鋼', pinyin: 'gāng', translation: 'Acero', type: 'core', nature: 'physical', description: 'El metal refinado e indestructible, el templado de la espada.' },
  { character: '晶', pinyin: 'jīng', translation: 'Cristal', type: 'core', nature: 'physical', description: 'La estructura mineral geométrica y translúcida.' },
  { character: '玻璃', pinyin: 'bōli', translation: 'Vidrio', type: 'core', nature: 'physical', description: 'El material silíceo fundido, cortante y transparente.' },
  { character: '聲', pinyin: 'shēng', translation: 'Sonido', type: 'core', nature: 'physical', description: 'La vibración sónica, el ruido sordo y la resonancia.' },
  { character: '影', pinyin: 'yǐng', translation: 'Sombra', type: 'core', nature: 'physical', description: 'La penumbra sutil, la ausencia de luz y el sigilo.' },
  { character: '暗', pinyin: 'àn', translation: 'Oscuridad', type: 'core', nature: 'physical', description: 'La negrura absoluta, la ausencia total de luz.' },
  { character: '毒', pinyin: 'dú', translation: 'Veneno', type: 'core', nature: 'physical', description: 'La sustancia tóxica que corrompe la carne y los fluidos.' },
  { character: '酸', pinyin: 'suān', translation: 'Ácido', type: 'core', nature: 'physical', description: 'La sustancia corrosiva que disuelve metales y tejidos.' },
  { character: '氣', pinyin: 'qì', translation: 'Gas/Aire/Vapor', type: 'core', nature: 'physical', description: 'El aire primordial, flujo de vida o viento invisible.' },
  { character: '蒸氣', pinyin: 'zhēngqì', translation: 'Vapor', type: 'core', nature: 'physical', description: 'La bruma caliente surgida del agua en contacto con el fuego.' },
  { character: '磁力', pinyin: 'cílì', translation: 'Magnetismo', type: 'core', nature: 'physical', description: 'La fuerza de atracción y repulsión entre metales.' },
  { character: '壓力', pinyin: 'yālì', translation: 'Presión', type: 'core', nature: 'physical', description: 'La fuerza compresiva ejercida sobre un área u objetivo.' },
  { character: '熱', pinyin: 'rè', translation: 'Calor', type: 'core', nature: 'physical', description: 'La energía térmica pura, la calidez extrema del fuego.' },
  { character: '寒', pinyin: 'hán', translation: 'Frío', type: 'core', nature: 'physical', description: 'La ausencia de calor, la frialdad que congela.' },
  { character: '星', pinyin: 'xīng', translation: 'Estrella', type: 'core', nature: 'physical', description: 'El brillo celeste lejano, el astro nocturno.' },
  { character: '月', pinyin: 'yuè', translation: 'Luna', type: 'core', nature: 'physical', description: 'La luminaria nocturna, asociada a los ciclos.' },
  { character: '日', pinyin: 'rì', translation: 'Sol', type: 'core', nature: 'physical', description: 'El disco solar diurno que irradia calor y luz.' },
  { character: '天空', pinyin: 'tiānkōng', translation: 'Cielo', type: 'core', nature: 'physical', description: 'La bóveda celeste sobre Castemare.' },
  { character: '海', pinyin: 'hǎi', translation: 'Mar', type: 'core', nature: 'physical', description: 'La gran masa de agua salada de la bahía.' },
  { character: '河', pinyin: 'hé', translation: 'Río', type: 'core', nature: 'physical', description: 'El curso de agua dulce continuo.' },
  { character: '森林', 'pinyin': 'sēnlín', translation: 'Bosque', type: 'core', nature: 'physical', description: 'La espesura de los árboles y la maleza.' },
  { character: '樹', pinyin: 'shù', translation: 'Árbol', type: 'core', nature: 'physical', description: 'La planta leñosa perenne con tronco.' },
  { character: '花', pinyin: 'huā', translation: 'Flor', type: 'core', nature: 'physical', description: 'La inflorescencia vegetal, delicada y colorida.' },
  { character: '根', pinyin: 'gēn', translation: 'Raíz', type: 'core', nature: 'physical', description: 'La estructura de anclaje vegetal subterránea.' },
  { character: '葉', pinyin: 'yè', translation: 'Hoja', type: 'core', nature: 'physical', description: 'La lámina clorofílica de las plantas.' },
  { character: '種子', pinyin: 'zhǒngzǐ', translation: 'Semilla', type: 'core', nature: 'physical', description: 'El grano germinal del que brota la vida vegetal.' },
  { character: '巖漿', pinyin: 'yánjiāng', translation: 'Lava', type: 'core', nature: 'physical', description: 'Roca fundida ardiente nacida del núcleo terrestre.' },
  { character: '濤', pinyin: 'tāo', translation: 'Oleada', type: 'core', nature: 'physical', description: 'Grandes olas del mar agitado de Castemare, de radical 氵.' },

  // NÚCLEOS ORGÁNICOS
  { character: '血', pinyin: 'xuè', translation: 'Sangre', type: 'core', nature: 'organic', description: 'El fluido vital, el calor biológico y el precio orgánico.' },
  { character: '骨', pinyin: 'gǔ', translation: 'Hueso', type: 'core', nature: 'organic', description: 'La estructura rígida interna, la dureza del esqueleto.' },
  { character: '肉', pinyin: 'ròu', translation: 'Carne', type: 'core', nature: 'organic', description: 'El tejido muscular y la materia orgánica corpórea.' },
  { character: '皮', pinyin: 'pí', translation: 'Piel', type: 'core', nature: 'organic', description: 'La barrera dérmica externa, el recubrimiento corporal.' },
  { character: '汗', pinyin: 'hàn', translation: 'Sudor', type: 'core', nature: 'organic', description: 'El fluido corporal excretado por calor o esfuerzo.' },
  { character: '淚', pinyin: 'lèi', translation: 'Lágrima', type: 'core', nature: 'organic', description: 'El fluido salino ocular asociado al dolor o la tristeza.' },
  { character: '骨髓', pinyin: 'gǔsuǐ', translation: 'Médula ósea', type: 'core', nature: 'organic', description: 'El tejido interno de los huesos donde reside la energía de la Médula.' },
  { character: '神經', pinyin: 'shénjīng', translation: 'Nervio', type: 'core', nature: 'organic', description: 'El canal transmisor de impulsos y dolor corporal.' },
  { character: '獸', pinyin: 'shòu', translation: 'Bestia', type: 'core', nature: 'organic', description: 'La criatura animal cuadrúpeda de los bosques.' },
  { character: '鳥', pinyin: 'niǎo', translation: 'Ave', type: 'core', nature: 'organic', description: 'La criatura alada que surca los cielos de Cauffen.' },
  { character: '蛇', pinyin: 'shé', translation: 'Serpiente', type: 'core', nature: 'organic', description: 'El reptil escamoso, silencioso y a menudo ponzoñoso.' },
  { character: '眼', pinyin: 'yǎn', translation: 'Ojo', type: 'core', nature: 'organic', description: 'El órgano sensorial de la visión y el discernimiento.' },
  { character: '耳', pinyin: 'ěr', translation: 'Oído', type: 'core', nature: 'organic', description: 'El órgano sensorial de la audición.' },
  { character: '舌', pinyin: 'shé', translation: 'Lengua', type: 'core', nature: 'organic', description: 'El órgano sensorial del gusto y la palabra.' },
  { character: '鼻', pinyin: 'bí', translation: 'Nariz', type: 'core', nature: 'organic', description: 'El órgano sensorial del olfato.' },
  { character: '手', pinyin: 'shǒu', translation: 'Mano', type: 'core', nature: 'organic', description: 'La extremidad del agarre, creadora de conjuros.' },
  { character: '足', pinyin: 'zú', translation: 'Pie', type: 'core', nature: 'organic', description: 'La extremidad del soporte y la locomoción.' },
  { character: '翼', pinyin: 'yì', translation: 'Ala', type: 'core', nature: 'organic', description: 'La extremidad del vuelo, ligera y membranosa o de pluma.' },
  { character: '爪', pinyin: 'zhuǎ', translation: 'Garra', type: 'core', nature: 'organic', description: 'La estructura de ataque córnea de las bestias.' },
  { character: '牙', pinyin: 'yá', translation: 'Diente/Colmillo', type: 'core', nature: 'organic', description: 'La estructura ósea bucal para triturar.' },
  { character: '鱗', pinyin: 'lín', translation: 'Escama', type: 'core', nature: 'organic', description: 'La cubierta protectora de peces, reptiles y dragones.' },
  { character: '甲', pinyin: 'jiǎ', translation: 'Caparazón/Armadura', type: 'core', nature: 'organic', description: 'La coraza protectora dura o caparazón.' },

  // NÚCLEOS ABSTRACTOS
  { character: '思', pinyin: 'sī', translation: 'Pensamiento', type: 'core', nature: 'abstract', description: 'La psique, la actividad cerebral y las mentes ajenas.' },
  { character: '意', pinyin: 'yì', translation: 'Intención/Voluntad', type: 'core', nature: 'abstract', description: 'La voluntad dirigida, el propósito concentrado del mago.' },
  { character: '念', pinyin: 'niàn', translation: 'Idea/Concentración', type: 'core', nature: 'abstract', description: 'La concentración mental pura, el concepto abstracto.' },
  { character: '魂', pinyin: 'hún', translation: 'Alma', type: 'core', nature: 'abstract', description: 'El espíritu residual, el fantasma y la esencia invisible.' },
  { character: '時間', pinyin: 'shíjiān', translation: 'Tiempo', type: 'core', nature: 'abstract', description: 'El transcurrir de las horas, los minutos ralentizados.' },
  { character: '魄', pinyin: 'pò', translation: 'Ánima Terrenal', type: 'core', nature: 'abstract', description: 'La fuerza vital del cuerpo físico, contraparte de 魂, radical 白/鬼.' },
  { character: '冥', pinyin: 'míng', translation: 'Penumbra', type: 'core', nature: 'abstract', description: 'Oscuridad profunda y misteriosa del abismo de radical 冖.' },
  { character: '靈', pinyin: 'líng', translation: 'Espíritu', type: 'core', nature: 'abstract', description: 'La fuerza espiritual invisible, la esencia metafísica pura.' },
  { character: '夢', pinyin: 'mèng', translation: 'Sueño', type: 'core', nature: 'abstract', description: 'La fantasía mental nocturna, el estado de ensoñación.' },
  { character: '記憶', pinyin: 'jìyì', translation: 'Memoria', type: 'core', nature: 'abstract', description: 'La facultad cognitiva de retener y recordar experiencias.' },
  { character: '空間', pinyin: 'kōngjiān', translation: 'Espacio', type: 'core', nature: 'abstract', description: 'La dimensión espacial, el vacío contenedor del todo.' },
  { character: '命運', pinyin: 'mìngyùn', translation: 'Destino', type: 'core', nature: 'abstract', description: 'El sendero predeterminado de los acontecimientos de la vida.' },
  { character: '運氣', pinyin: 'yùnqi', translation: 'Suerte', type: 'core', nature: 'abstract', description: 'El azar favorable o desfavorable que influye en los hechos.' },
  { character: '恐懼', pinyin: 'kǒngjù', translation: 'Miedo', type: 'core', nature: 'abstract', description: 'La emoción del pavor, la aprensión ante el peligro.' },
  { character: '怒', pinyin: 'nù', translation: 'Ira', type: 'core', nature: 'abstract', description: 'La emoción de la rabia, la furia ardiente de la mente.' },
  { character: '愛', pinyin: 'ài', translation: 'Amor', type: 'core', nature: 'abstract', description: 'La emoción del afecto profundo y la devoción.' },
  { character: '悲', pinyin: 'bēi', translation: 'Tristeza', type: 'core', nature: 'abstract', description: 'La emoción del dolor anímico y el llanto silencioso.' },
  { character: '喜', pinyin: 'xǐ', translation: 'Alegría', type: 'core', nature: 'abstract', description: 'La emoción del júbilo y la celebración mental.' },
  { character: '信念', pinyin: 'xìnniàn', translation: 'Creencia/Fe', type: 'core', nature: 'abstract', description: 'La convicción absoluta y la fe del alma.' },
  { character: '秩序', pinyin: 'zhìxù', translation: 'Orden', type: 'core', nature: 'abstract', description: 'La estructura armoniosa, la ley y la regularidad cosmogónica.' },
  { character: '混沌', pinyin: 'hùndùn', translation: 'Caos', type: 'core', nature: 'abstract', description: 'La entropía primordial, el desorden y la confusión total.' },
  { character: '真相', pinyin: 'zhēnxiàng', translation: 'Verdad', type: 'core', nature: 'abstract', description: 'La realidad objetiva, la revelación genuina sin velos.' },
  { character: '謊言', pinyin: 'huǎngyán', translation: 'Mentira', type: 'core', nature: 'abstract', description: 'La falsedad tejida para engañar o proteger.' },
  { character: '氣息', pinyin: 'qìxī', translation: 'Aliento/Aura', type: 'core', nature: 'abstract', description: 'El aura vital que emana de los seres vivos.' },
  { character: '生命', pinyin: 'shēngmìng', translation: 'Vida', type: 'core', nature: 'abstract', description: 'El aliento de la existencia y la fuerza vital orgánica.' },
  { character: '死亡', pinyin: 'sǐwáng', translation: 'Muerte', type: 'core', nature: 'abstract', description: 'El fin del ciclo vital, la cesación y el letargo.' },
  { character: '虛無', pinyin: 'xūwú', translation: 'Vacío/La nada', type: 'core', nature: 'abstract', description: 'La nada filosófica, el vacío absoluto donde cesa todo.' },
  { character: '天界', pinyin: 'tiānjiè', translation: 'Reino celestial', type: 'core', nature: 'abstract', description: 'El plano superior de luz y existencia divina.' },
  { character: '深淵', pinyin: 'shēnyuān', translation: 'Abismo', type: 'core', nature: 'abstract', description: 'La sima más profunda y oscura del plano espiritual.' },

  // NÚCLEOS DUALES
  { character: '重力', pinyin: 'zhònglì', translation: 'Gravedad', type: 'core', nature: 'dual', description: 'La atracción de la materia, la fuerza sorda del suelo.' },
  { character: '能量', pinyin: 'néngliàng', translation: 'Energía', type: 'core', nature: 'dual', description: 'La fuerza pura desprovista de elemento físico.' },
  { character: '心', pinyin: 'xīn', translation: 'Corazón/Mente', type: 'core', nature: 'dual', description: 'Sede de las emociones y órgano vital, puente físico-abstracto.' },
  { character: '痛苦', pinyin: 'tòngkǔ', translation: 'Dolor/Sufrimiento', type: 'core', nature: 'dual', description: 'La experiencia dual del dolor corporal y mental.' },
  { character: '聲音', pinyin: 'shēngyīn', translation: 'Voz/Sonido', type: 'core', nature: 'dual', description: 'La percepción acústica y la emisión vocal con significado.' },
  { character: '龍', pinyin: 'lóng', translation: 'Dragón', type: 'core', nature: 'dual', description: 'La majestuosa criatura mítica de poder elemental.' },

  // VERBOS FÍSICOS
  { character: '發', pinyin: 'fā', translation: 'Emitir', type: 'verb', nature: 'physical', description: 'Disparar o proyectar el elemento hacia fuera.' },
  { character: '射', pinyin: 'shè', translation: 'Disparar/Lanzar', type: 'verb', nature: 'physical', description: 'Lanzar un proyectil mágico con precisión.' },
  { character: '聚', pinyin: 'jù', translation: 'Concentrar', type: 'verb', nature: 'physical', description: 'Reunir, densificar o aglutinar en un punto.' },
  { character: '散', pinyin: 'sàn', translation: 'Dispersar', type: 'verb', nature: 'physical', description: 'Diseminar, esparcir o difundir la materia.' },
  { character: '轉', pinyin: 'zhuǎn', translation: 'Desviar', type: 'verb', nature: 'physical', description: 'Redirigir, doblar o alterar la trayectoria física.' },
  { character: '破', pinyin: 'pò', translation: 'Romper', type: 'verb', nature: 'physical', description: 'Destruir, fracturar o estallar físicamente.' },
  { character: '碎', pinyin: 'suì', translation: 'Hacer añicos', type: 'verb', nature: 'physical', description: 'Pulverizar o quebrar el objetivo en fragmentos diminutos.' },
  { character: '裂', pinyin: 'liè', translation: 'Agrietar', type: 'verb', nature: 'physical', description: 'Hacer grietas o fisuras en la estructura del objetivo.' },
  { character: '護', pinyin: 'hù', translation: 'Proteger', type: 'verb', nature: 'physical', description: 'Formar un escudo, barrera o amparo rígido.' },
  { character: '擋', pinyin: 'dǎng', translation: 'Bloquear', type: 'verb', nature: 'physical', description: 'Interceptar o frenar un embate o ataque.' },
  { character: '束', pinyin: 'shù', translation: 'Atar', type: 'verb', nature: 'physical', description: 'Restringir, amarrar o encadenar el movement.' },
  { character: '縛', pinyin: 'fù', translation: 'Amarrar', type: 'verb', nature: 'physical', description: 'Sujetar estrechamente impidiendo cualquier movimiento.' },
  { character: '割', pinyin: 'gē', translation: 'Cortar', type: 'verb', nature: 'physical', description: 'Cercenar, rebanar o herir con filo.' },
  { character: '斬', pinyin: 'zhǎn', translation: 'Tajar/Cercenar', type: 'verb', nature: 'physical', description: 'Golpear con gran fuerza cortante para seccionar.' },
  { character: '燃', pinyin: 'rán', translation: 'Quemar', type: 'verb', nature: 'physical', description: 'Encender, inflamar o arder con calor físico.' },
  { character: '燒', pinyin: 'shāo', translation: 'Arder', type: 'verb', nature: 'physical', description: 'Quemar o consumir con llamas continuas.' },
  { character: '凍', pinyin: 'dòng', translation: 'Congelar', type: 'verb', nature: 'physical', description: 'Solidificar por frío extremo, inmovilizar con hielo.' },
  { character: '融', pinyin: 'róng', translation: 'Derretir/Fundir', type: 'verb', nature: 'physical', description: 'Licuar un sólido mediante la aplicación de calor.' },
  { character: '吸', pinyin: 'xī', translation: 'Absorber', type: 'verb', nature: 'physical', description: 'Aspirar, succionar o drenar materia o energía.' },
  { character: '噴', pinyin: 'pēn', translation: 'Expulsar/Rociar', type: 'verb', nature: 'physical', description: 'Lanzar un chorro de materia líquida o gaseosa a presión.' },
  { character: '爆', pinyin: 'bào', translation: 'Explotar', type: 'verb', nature: 'physical', description: 'Detonar con estruendo violento y expansivo.' },
  { character: '炸', pinyin: 'zhà', translation: 'Estallar', type: 'verb', nature: 'physical', description: 'Producir un estallido súbito y destructivo.' },
  { character: '腐', pinyin: 'fǔ', translation: 'Pudrir/Corroer', type: 'verb', nature: 'physical', description: 'Descomponer de forma orgánica la materia.' },
  { character: '蝕', pinyin: 'shí', translation: 'Corroer', type: 'verb', nature: 'physical', description: 'Desgastar o carcomer paulatinamente una sustancia.' },
  { character: '壓', pinyin: 'yā', translation: 'Presionar/Aplastar', type: 'verb', nature: 'physical', description: 'Ejercer fuerza descendente o compresiva severa.' },
  { character: '拉', pinyin: 'lā', translation: 'Tirar/Atraer', type: 'verb', nature: 'physical', description: 'Atraer un elemento u objetivo hacia la posición del mago.' },
  { character: '推', pinyin: 'tuī', translation: 'Empujar', type: 'verb', nature: 'physical', description: 'Repeler o desplazar un elemento u objetivo hacia adelante.' },
  { character: '升', pinyin: 'shēng', translation: 'Elevar', type: 'verb', nature: 'physical', description: 'Hacer subir o levitar un elemento u objetivo.' },
  { character: '墜', pinyin: 'zhuì', translation: 'Caer/Precipitar', type: 'verb', nature: 'physical', description: 'Hacer descender o colapsar con fuerza hacia el suelo.' },
  { character: '穿', pinyin: 'chuān', translation: 'Atravesar', type: 'verb', nature: 'physical', description: 'Perforar o penetrar limpiamente un obstáculo.' },
  { character: '鎖', pinyin: 'suǒ', translation: 'Sellar/Bloquear', type: 'verb', nature: 'physical', description: 'Sellar o bloquear herméticamente la contención.' },
  { character: '封', pinyin: 'fēng', translation: 'Sellar', type: 'verb', nature: 'physical', description: 'Imponer un sello mágico que inmoviliza o clausura.' },
  { character: '繞', pinyin: 'rào', translation: 'Rodear/Envolver', type: 'verb', nature: 'physical', description: 'Hacer que un elemento envuelva o gire en torno al objetivo.' },
  { character: '震', pinyin: 'zhèn', translation: 'Sacudir/Vibrar', type: 'verb', nature: 'physical', description: 'Provocar vibraciones sísmicas o sacudidas violentas.' },
  { character: '爬', pinyin: 'pá', translation: 'Trepar/Reptar', type: 'verb', nature: 'physical', description: 'Hacer avanzar reptando o ascendiendo al elemento.' },
  { character: '飛', pinyin: 'fēi', translation: 'Volar', type: 'verb', nature: 'physical', description: 'Hacer que el elemento surque el aire libremente.' },
  { character: '沉', pinyin: 'chén', translation: 'Hundir', type: 'verb', nature: 'physical', description: 'Hacer descender un elemento en un fluido o en la tierra.' },
  { character: '浮', pinyin: 'fú', translation: 'Flotar', type: 'verb', nature: 'physical', description: 'Mantener un elemento suspendido en el aire o agua.' },
  { character: '擊', pinyin: 'jī', translation: 'Golpear', type: 'verb', nature: 'physical', description: 'Asestar un impacto contundente de fuerza mágica.' },
  { character: '砍', pinyin: 'kǎn', translation: 'Hachar/Cortar', type: 'verb', nature: 'physical', description: 'Descargar un golpe tajante con fuerza física.' },
  { character: '刺', pinyin: 'cì', translation: 'Apuñalar/Pinchar', type: 'verb', nature: 'physical', description: 'Penetrar con un punto punzante y agudo.' },
  { character: '盾', pinyin: 'dùn', translation: 'Escudar', type: 'verb', nature: 'physical', description: 'Interponer una defensa compacta y esférica.' },
  { character: '躲', pinyin: 'duǒ', translation: 'Esquivar', type: 'verb', nature: 'physical', description: 'Evadir de forma ágil un embate físico o mágico.' },
  { character: '閃', pinyin: 'shǎn', translation: 'Relampaguear/Esquivar', type: 'verb', nature: 'physical', description: 'Esquivar de forma veloz como un parpadeo de luz.' },
  { character: '追', pinyin: 'zhuī', translation: 'Perseguir', type: 'verb', nature: 'physical', description: 'Rastrear o ir tras la trayectoria del objetivo.' },
  { character: '逃', pinyin: 'táo', translation: 'Huir', type: 'verb', nature: 'physical', description: 'Desplazar el elemento alejándolo con presteza del peligro.' },
  { character: '困', pinyin: 'kùn', translation: 'Atrapar/Aprisionar', type: 'verb', nature: 'physical', description: 'Clausurar y aprisionar al objetivo en un perímetro.' },
  { character: '釋放', pinyin: 'shìfàng', translation: 'Liberar', type: 'verb', nature: 'physical', description: 'Garantizar la salida o liberación del caudal retenido.' },
  { character: '觸', pinyin: 'chù', translation: 'Tocar', type: 'verb', nature: 'physical', description: 'Establecer contacto tangible con las corrientes de energía.' },
  { character: '築', pinyin: 'zhù', translation: 'Construir/Erigir', type: 'verb', nature: 'physical', description: 'Cimentar estructuras pétreas o sólidas estables.' },
  { character: '拆', pinyin: 'chāi', translation: 'Desmontar', type: 'verb', nature: 'physical', description: 'Desarticular de forma quirúrgica una estructura rígida.' },
  { character: '湧', pinyin: 'yǒng', translation: 'Brotar', type: 'verb', nature: 'physical', description: 'Surgir o manar con fuerza, de radical 氵 (agua).' },
  { character: '滅', pinyin: 'miè', translation: 'Extinguir', type: 'verb', nature: 'physical', description: 'Apagar la luz o el fuego, destruir, de radical 氵.' },
  { character: '煞', pinyin: 'shà', translation: 'Frenar/Sellar', type: 'verb', nature: 'physical', description: 'Detener en seco o someter una fuerza, de radical 灬 (fuego abajo).' },

  // VERBOS ABSTRACTOS
  { character: '感', pinyin: 'gǎn', translation: 'Sentir', type: 'verb', nature: 'abstract', description: 'Percibir, notar u oler sensaciones invisibles o mentes.' },
  { character: '憶', pinyin: 'yì', translation: 'Recordar', type: 'verb', nature: 'abstract', description: 'Traer a la mente memorias o pensamientos pasados.' },
  { character: '忘', pinyin: 'wàng', translation: 'Olvidar', type: 'verb', nature: 'abstract', description: 'Borrar o desdibujar recuerdos o cogniciones.' },
  { character: '懼', pinyin: 'jù', translation: 'Temer', type: 'verb', nature: 'abstract', description: 'Infundir espanto o infundir terror en la mente ajena.' },
  { character: '信', pinyin: 'xìn', translation: 'Creer', type: 'verb', nature: 'abstract', description: 'Tener fe o asimilar como verdad absoluta.' },
  { character: '悟', pinyin: 'wù', translation: 'Comprender/Iluminarse', type: 'verb', nature: 'abstract', description: 'Alcanzar una revelación o entendimiento profundo de la magia.' },
  { character: '惑', pinyin: 'huò', translation: 'Confundir', type: 'verb', nature: 'abstract', description: 'Enturbiar el entendimiento o caotizar los pensamientos.' },
  { character: '契', pinyin: 'qì', translation: 'Pactar/Vincular', type: 'verb', nature: 'abstract', description: 'Establecer un lazo indisoluble de naturaleza mística.' },
  { character: '縛靈', pinyin: 'fùlíng', translation: 'Atar espíritu', type: 'verb', nature: 'abstract', description: 'Restringir y retener un ente espiritual o alma.' },
  { character: '看', pinyin: 'kàn', translation: 'Ver', type: 'verb', nature: 'abstract', description: 'Visualizar con ojos de magia lo oculto.' },
  { character: '聽', pinyin: 'tīng', translation: 'Oír', type: 'verb', nature: 'abstract', description: 'Escuchar las frecuencias y resonancias secretas.' },
  { character: '嗅', pinyin: 'xiù', translation: 'Olfatear', type: 'verb', nature: 'abstract', description: 'Percibir trazas de fragancias anímicas y venenos en suspensión.' },
  { character: '測', pinyin: 'cè', translation: 'Medir/Detectar', type: 'verb', nature: 'abstract', description: 'Evaluar con precisión magnitudes o presencias mágicas.' },
  { character: '尋', pinyin: 'xún', translation: 'Buscar', type: 'verb', nature: 'abstract', description: 'Rastrear e indagar el paradero de un elemento u alma.' },

  // VERBOS PUENTES
  { character: '傳', pinyin: 'chuán', translation: 'Transmitir', type: 'verb', nature: 'bridge', description: 'Canalizar o transportar (sirve como puente abstracto-físico).' },
  { character: '引', pinyin: 'yǐn', translation: 'Guiar', type: 'verb', nature: 'bridge', description: 'Atraer o encauzar (sirve como puente).' },
  { character: '控', pinyin: 'kòng', translation: 'Controlar', type: 'verb', nature: 'bridge', description: 'Dominar con firmeza la mente o el cuerpo.' },
  { character: '喚', pinyin: 'huàn', translation: 'Invocar/Llamar', type: 'verb', nature: 'bridge', description: 'Llamar o materializar fuerzas y entidades a través del ritual.' },
  { character: '渡', pinyin: 'dù', translation: 'Transferir', type: 'verb', nature: 'bridge', description: 'Trasladar esencia, calor o energía de un punto a otro.' },
  { character: '變', pinyin: 'biàn', translation: 'Transformar/Cambiar', type: 'verb', nature: 'bridge', description: 'Alterar la forma externa o estado del elemento.' },
  { character: '化', pinyin: 'huà', translation: 'Convertir/Transmutar', type: 'verb', nature: 'bridge', description: 'Alterar la naturaleza interna y transmutar la materia.' },
  { character: '生', pinyin: 'shēng', translation: 'Generar/Crear', type: 'verb', nature: 'bridge', description: 'Dar vida, engendrar o crear de la nada.' },
  { character: '強化', pinyin: 'qiánghuà', translation: 'Potenciar', type: 'verb', nature: 'bridge', description: 'Aumentar las cualidades de lo existente de forma artificial.' },
  { character: '弱化', pinyin: 'ruòhuà', translation: 'Debilitar (V)', type: 'verb', nature: 'bridge', description: 'Mermar y desgastar los atributos o el vigor.' },
  { character: '喚醒', pinyin: 'huànxǐng', translation: 'Despertar', type: 'verb', nature: 'bridge', description: 'Activar fuerzas durmientes o latencias.' },
  { character: '沉睡', pinyin: 'chénshui', translation: 'Adormecer', type: 'verb', nature: 'bridge', description: 'Soporizar o desactivar fuerzas mágicas en reposo.' },

  // VERBOS DUALES
  { character: '隱', pinyin: 'yǐn', translation: 'Ocultar', type: 'verb', nature: 'dual', description: 'Invisibilizar, atenuar o esconder la materia o el pensamiento.' },
  { character: '癒', pinyin: 'yù', translation: 'Curar', type: 'verb', nature: 'dual', description: 'Sanar heridas, reparar tejido orgánico o estabilizar.' },
  { character: '現', pinyin: 'xiàn', translation: 'Revelar/Manifestar', type: 'verb', nature: 'dual', description: 'Hacer visible o tangible lo que estaba oculto.' },
  { character: '治', pinyin: 'zhì', translation: 'Tratar/Curar', type: 'verb', nature: 'dual', description: 'Tratar y mitigar enfermedades o aflicciones.' },
  { character: '復原', pinyin: 'fùyuán', translation: 'Restaurar/Regenerar', type: 'verb', nature: 'dual', description: 'Deshacer daños y devolver al estado primordial original.' },
  { character: '再生', pinyin: 'zàishēng', translation: 'Regenerar', type: 'verb', nature: 'dual', description: 'Restaurar tejidos o energía de forma continua.' },
  { character: '織', pinyin: 'zhī', translation: 'Tejer', type: 'verb', nature: 'dual', description: 'Entrelazar hilos de tinta y magia para formar mallas complejas.' },

  // MODIFICADORES
  { character: '加速', pinyin: 'jiāsù', translation: 'Acelerar', type: 'modifier', description: 'Incrementar la velocidad y el dinamismo de la acción.' },
  { character: '強', pinyin: 'qiáng', translation: 'Intensificar', type: 'modifier', description: 'Fortalecer el impacto o el vigor del conjuro.' },
  { character: '弱', pinyin: 'ruò', translation: 'Debilitar', type: 'modifier', description: 'Atenuar, mitigar o disminuir la fuerza del objetivo.' },
  { character: '廣', pinyin: 'guǎng', translation: 'Expandir', type: 'modifier', description: 'Ampliar el alcance o radio de la magia.' },
  { character: '縮', pinyin: 'suō', translation: 'Contraer', type: 'modifier', description: 'Disminuir drásticamente el área del efecto.' },
  { character: '鎖定', pinyin: 'suǒdìng', translation: 'Fijar', type: 'modifier', description: 'Bloquear y asegurar el objetivo para evitar que evada el conjuro.' },
  { character: '倍', pinyin: 'bèi', translation: 'Duplicar', type: 'modifier', description: 'Multiplicar por dos la escala o cantidad del efecto.' },
  { character: '半', pinyin: 'bàn', translation: 'Mitad', type: 'modifier', description: 'Disminuir a la mitad la fuerza o tamaño.' },
  { character: '逆', pinyin: 'nì', translation: 'Invertir', type: 'modifier', description: 'Voltear, revertir o cambiar al opuesto.' },
  { character: '密', pinyin: 'mì', translation: 'Densificar', type: 'modifier', description: 'Concentrar, compactar o espesar la materia.' },
  { character: '緩', pinyin: 'huǎn', translation: 'Ralentizar', type: 'modifier', description: 'Hacer más lenta la acción o el transcurso físico.' },
  { character: '精', pinyin: 'jīng', translation: 'Refinar', type: 'modifier', description: 'Precisar o pulir el foco de la magia.' },
  { character: '粗', pinyin: 'cū', translation: 'Tosco/Impreciso', type: 'modifier', description: 'Hacer tosco, amplio e impreciso el flujo.' },
  { character: '穩', pinyin: 'wěn', translation: 'Estabilizar', type: 'modifier', description: 'Asegurar la firmeza y eliminar perturbaciones.' },
  { character: '亂', pinyin: 'luàn', translation: 'Desestabilizar/Caotizar', type: 'modifier', description: 'Fomentar la turbulencia y desordenar la corriente.' },
  { character: '深', pinyin: 'shēn', translation: 'Profundizar', type: 'modifier', description: 'Hacer penetrar la magia en capas más profundas.' },
  { character: '淺', pinyin: 'qiǎn', translation: 'Superficial', type: 'modifier', description: 'Mantener el efecto solo en la capa externa.' },
  { character: '久', pinyin: 'jiǔ', translation: 'Prolongar', type: 'modifier', description: 'Hacer durar el efecto por un lapso extenso.' },
  { character: '瞬', pinyin: 'shùn', translation: 'Instantáneo', type: 'modifier', description: 'Resolver el conjuro en un instante imperceptible.' },
  { character: '延', pinyin: 'yán', translation: 'Retrasar', type: 'modifier', description: 'Retardar y prolongar la resolución.' },
  { character: '重', pinyin: 'zhòng', translation: 'Pesado', type: 'modifier', description: 'Aumentar la masa y la gravedad de la descarga.' },
  { character: '輕', pinyin: 'qīng', translation: 'Ligero', type: 'modifier', description: 'Quitar peso e infundir sutileza aérea.' },
  { character: '純', pinyin: 'chún', translation: 'Purificar', type: 'modifier', description: 'Excluir cualquier impureza o elemento secundario.' },
  { character: '污', pinyin: 'wū', translation: 'Corromper/Contaminar', type: 'modifier', description: 'Inocular agentes deletéreos e impurezas.' },
  { character: '烈', pinyin: 'liè', translation: 'Ardiente', type: 'modifier', description: 'Violento o abrasador, de radical 灬.' },
  { character: '柔', pinyin: 'róu', translation: 'Suavizar', type: 'modifier', description: 'Mitigar la violencia mecánica y hacerlo fluido.' },
  { character: '銳', pinyin: 'ruì', translation: 'Afilar', type: 'modifier', description: 'Dotar de filo extremo o agudeza cortante.' },
  { character: '鈍', pinyin: 'dùn', translation: 'Embotado', type: 'modifier', description: 'Quitar el filo o embotar el filo del impacto.' },
  { character: '全', pinyin: 'quán', translation: 'Completar/Total', type: 'modifier', description: 'Extender el efecto al cien por ciento.' },
  { character: '半途', pinyin: 'bàntú', translation: 'A medio camino', type: 'modifier', description: 'Interrumpir el efecto de forma prematura.' },
  { character: '熾', pinyin: 'chì', translation: 'Incandescente', type: 'modifier', description: 'Fuego vivo, resplandor extremo de radical 火.' },
  { character: '痛', pinyin: 'tòng', translation: 'Dolor', type: 'modifier', description: 'Un impacto doloroso que espolea la Médula, radical 疒 (enfermedad/ardor).' },

  // DIRECCIONES Y FORMAS
  { character: '前', pinyin: 'qián', translation: 'Adelante', type: 'direction', description: 'Proyección rectilínea frontal.' },
  { character: '後', pinyin: 'hòu', translation: 'Atrás', type: 'direction', description: 'Proyección rectilínea trasera.' },
  { character: '上', pinyin: 'shàng', translation: 'Arriba', type: 'direction', description: 'Proyección vertical ascendente.' },
  { character: '下', pinyin: 'xià', translation: 'Abajo', type: 'direction', description: 'Proyección vertical descendente.' },
  { character: '左', pinyin: 'zuǒ', translation: 'Izquierda', type: 'direction', description: 'Proyección lateral izquierda.' },
  { character: '右', pinyin: 'yòu', translation: 'Derecha', type: 'direction', description: 'Proyección lateral derecha.' },
  { character: '內', pinyin: 'nèi', translation: 'Interior', type: 'direction', description: 'Foco interno, hacia dentro.' },
  { character: '外', pinyin: 'wài', translation: 'Exterior', type: 'direction', description: 'Foco externo, hacia fuera.' },
  { character: '環', pinyin: 'huán', translation: 'Circular', type: 'direction', description: 'Geometría circular, anillo o aura protectora.' },
  { character: '球', pinyin: 'qiú', translation: 'Esférico', type: 'direction', description: 'Geometría tridimensional compacta.' },
  { character: '線', pinyin: 'xiàn', translation: 'Lineal', type: 'direction', description: 'Haz o vector perfectamente recto.' },
  { character: '散形', pinyin: 'sànxíng', translation: 'Disperso (Dir)', type: 'direction', description: 'Área de impacto difusa.' },
  { character: '錐', pinyin: 'zhuī', translation: 'Cónico', type: 'direction', description: 'Forma cónica abierta en embudo.' },
  { character: '牆', pinyin: 'qiáng', translation: 'Muro', type: 'direction', description: 'Erigir el efecto en un panel o muro.' },
  { character: '螺旋', pinyin: 'luóxuán', translation: 'Espiral', type: 'direction', description: 'Trayectoria helicoidal o de rosca.' },
  { character: '弧', pinyin: 'hú', translation: 'Curvo/Arco', type: 'direction', description: 'Senda arqueada o con curvatura.' },
  { character: '點', pinyin: 'diǎn', translation: 'Puntual', type: 'direction', description: 'Foco concentrado en un único punto espacial.' },
  { character: '網', pinyin: 'wǎng', translation: 'Red', type: 'direction', description: 'Estructura en rejilla o malla.' },
  { character: '遠', pinyin: 'yuǎn', translation: 'Lejano', type: 'direction', description: 'Efecto de largo alcance.' },
  { character: '近', pinyin: 'jìn', translation: 'Cercano', type: 'direction', description: 'Efecto de corto alcance.' },
  { character: '周圍', pinyin: 'zhōuwéi', translation: 'Alrededor', type: 'direction', description: 'Expansión radial total en todas direcciones.' },
  { character: '對角', pinyin: 'duìjiǎo', translation: 'Diagonal', type: 'direction', description: 'Orientación de corte diagonal.' },

  // PARTÍCULAS
  { character: '的', pinyin: 'de', translation: 'de (Pos)', type: 'particle', description: 'Conector posesivo o modificador sustantivo.' },
  { character: '地', pinyin: 'de', translation: 'de (Adv)', type: 'particle', description: 'Adverbializador (colocado antes del verbo).' },
  { character: '了', pinyin: 'le', translation: 'Completado', type: 'particle', description: 'Acción instantánea y terminada, no continua.' },
  { character: '著', pinyin: 'zhe', translation: 'Continuo', type: 'particle', description: 'Acción continua, mantenida o en progreso en el tiempo.' },
  { character: '過', pinyin: 'guò', translation: 'Pasado', type: 'particle', description: 'Experiencia previa o acción consolidada.' },
  { character: '不', pinyin: 'bù', translation: 'No (Verb)', type: 'particle', description: 'Negación del verbo, invierte o cancela la acción.' },
  { character: '無', pinyin: 'wú', translation: 'Sin (Core)', type: 'particle', description: 'Negación o ausencia del núcleo.' },
  { character: '未', pinyin: 'wèi', translation: 'Aún no', type: 'particle', description: 'Latencia de acción no resuelta aún.' },
  { character: '之', pinyin: 'zhī', translation: 'de (Clas)', type: 'particle', description: 'Posesivo clásico arcaico del grimorio.' },
  { character: '與', pinyin: 'yǔ', translation: 'y / con', type: 'particle', description: 'Conjunción para entrelazar múltiples núcleos.' },
  { character: '而', pinyin: 'ér', translation: 'luego', type: 'particle', description: 'Conector secuencial entre dos acciones.' },
  { character: '或', pinyin: 'huò', translation: 'ó / alternativo', type: 'particle', description: 'Conjunción disyuntiva para efectos bifurcados.' },
  { character: '若', pinyin: 'ruò', translation: 'si (Cond)', type: 'particle', description: 'Iniciador condicional de un evento.' },
  { character: '則', pinyin: 'zé', translation: 'entonces', type: 'particle', description: 'Consecuente de una premisa condicional.' },
  { character: '也', pinyin: 'yě', translation: 'también', type: 'particle', description: 'Efecto aditivo que replica la descarga.' },
  { character: '又', pinyin: 'yòu', translation: 'de nuevo', type: 'particle', description: 'Reiteración inmediata del efecto.' },
  { character: '再', pinyin: 'zài', translation: 'otra vez', type: 'particle', description: 'Segunda ejecución de la acción verbal.' },
  { character: '皆', pinyin: 'jiē', translation: 'todos', type: 'particle', description: 'Generalización universal de objetivos.' },
  { character: '唯', pinyin: 'wéi', translation: 'solo', type: 'particle', description: 'Restricción exclusiva a un elemento.' },
  { character: '自', pinyin: 'zì', translation: 'desde / sí mismo', type: 'particle', description: 'Origen o reflexivo del propio mago.' },
  { character: '其', pinyin: 'qí', translation: 'su / de aquel', type: 'particle', description: 'Referencial posesivo de un tercero.' },
  { character: '于', pinyin: 'yú', translation: 'en / a / hacia', type: 'particle', description: 'Preposición locativa arcaica para dirigir el conjuro.' },
  { character: '以', pinyin: 'yǐ', translation: 'con / mediante', type: 'particle', description: 'Conector instrumental clásico para moldear mediante un elemento.' },
  { character: '及', pinyin: 'jí', translation: 'así como / y también', type: 'particle', description: 'Conjunción copulativa clásica de adición.' },
  { character: '为', pinyin: 'wéi', translation: 'convertirse en', type: 'particle', description: 'Cópula clásica para indicar transmutación o rol.' },
  { character: '焉', pinyin: 'yān', translation: 'allí / en ello', type: 'particle', description: 'Partícula locativa o asertiva de cierre ceremonial.' },
  { character: '矣', pinyin: 'yǐ', translation: '¡ya! / concluido', type: 'particle', description: 'Partícula clásica que marca un cambio de estado consolidado.' },
  { character: '哉', pinyin: 'zāi', translation: '¡oh! / exclamación', type: 'particle', description: 'Partícula de exclamación o énfasis espiritual clásico.' },
  { character: '如', pinyin: 'rú', translation: 'semejante a / como', type: 'particle', description: 'Conector comparativo para replicar cualidades elementales.' }
];

export const VIOLET_FORMULAS: { [key: string]: string } = {
  '火 發 強 前': 'Lanzas una ráfaga concentrada de llamas intensificadas hacia adelante, iluminando con furia la gotera de la sala principal y llenando el aire de vapor ardiente.',
  '水 護 環': 'Un escudo translúcido de agua templada se despliega en un anillo perfecto a tu alrededor, repeliendo la humedad costera de Castemare con un rumor pacífico.',
  '思 感': 'Sintonizas tu mente y logras percibir un retazo de los pensamientos temerosos de Mateo, quien disimula su espanto bajo su habitual rectitud silenciosa.',
  '能量 發 加速 前': 'Proyectas un pulso lineal de fuerza pura acelerada que impacta en la pared del castillo, haciendo temblar los marcos de la galería de retratos de los Montenegro.',
  '能量 轉 加速': 'Logras desviar de forma inmediata el vector del viento que entra por el ventanal, acelerando su curso hacia el techo de la sala principal.',
  '火 燃': 'Una llama mansa y templada nace sobre la yema de tus dedos, proporcionando un abrigo de luz reconfortante frente al frío de la costa.',
  '水 凍 後': 'Un torrente de agua surge a tu espalda y se congela instantáneamente en estalagmitas de hielo azulado que bloquean el umbral.',
  '風 聚 環': 'El aire húmedo del acantilado se congrega en un anillo de viento cortante y ruidoso que agita tus ropas de Marqués.',
  '光 發 前': 'Un destello deslumbrante de luz solar pura sale despedido hacia el corredor, cegando momentáneamente las sombras que acechan el ala norte.',
  '土 護': 'La tierra firme bajo las baldosas agrietadas se eleva unos centímetros, consolidando un amparo pétreo impenetrable.',
  '思 傳 破': 'Canalizas un pulso mental violento que agrieta momentáneamente la concentración de quienes te observan, provocándoles un parpadeo confuso.',
  '意 引 聚': 'Tu pura voluntad guía y atrae el polvo y las hojas secas de la sala principal hacia un vórtice compacto en el aire.',
  '念 感': 'Percibes la vibración de una antigua directriz o ideal impreso en los muebles carcomidos por la salitre de Cauffen.',
  '重力 聚 下': 'La gravedad se duplica súbitamente en el cuadrante inferior, aplastando los escombros sueltos contra el suelo de piedra.',
  '時間 隱 緩': 'Ocultas la presencia de tus movimientos, haciendo que el fluir de la escena parezca congelarse o ralentizarse en tus ojos.',
  '魂 感': 'Sientes el frío sordo y el orgullo residual de Don Rodrigo de Montenegro, cuyo retrato severo cuelga inmóvil junto al sable familiar.',
  '血 癒': 'La sangre de tus nudillos heridos retrocede hacia la carne abierta, sellando la piel con una costra oscura de forma antinatural.',
  '骨 束 環': 'Un lazo rígido con la dureza del esmalte óseo brota en círculo, constriñendo firmemente el espacio a tu alrededor.',
  // NEW RADICAL SPELLS
  '濤 湧 環': 'Invocas un oleaje brotante de agua marina que surge en un anillo arremolinado a tu alrededor, deteniendo en seco cualquier agresión física o reflujo.',
  '氣 聚 強 前': 'Concentras el aliento primordial y lo proyectas hacia adelante como un vendaval intensificado capaz de derribar las pesadas puertas del ala norte.',
  '岩 護': 'Rocas de riscos escarpados emergen abruptamente del suelo agrietado de la sala principal, formando un baluarte pétreo impenetrable.',
  '冥 隱 緩': 'Te sumerges en la penumbra misteriosa del abismo de los Montenegro, ralentizando el paso del tiempo a tu alrededor y fundiéndote con el sigilo absoluto.',
  '熾 燃 爆': 'Un calor incandescente de fuego puro brota de tu grimorio y detona con una fuerza devastadora que disipa la niebla salina de Cauffen.'
};

export const MEDULA_STATES: MedulaStateDetails[] = [
  {
    state: '充沛',
    pinyin: 'chōngpèi',
    sensation: 'Calor uniforme en el esternón y los dientes.',
    narrativeModel: 'La columna de tinta en el frasco del grimorio está hasta el borde. Antonio siente calor en los dientes.',
    index: 0
  },
  {
    state: '旺',
    pinyin: 'wàng',
    sensation: 'Cuerpo suelto, mente clara, dedos ágiles.',
    narrativeModel: 'El frasco de tinta mágica está a tres cuartos de su capacidad. Antonio se siente vigoroso y despejado.',
    index: 1
  },
  {
    state: '平稳',
    pinyin: 'wěnxiáng',
    sensation: 'Tibieza estable, como el cuerpo después de comer.',
    narrativeModel: 'La columna de tinta del grimorio ha bajado a la mitad. Antonio todavía se siente entero y equilibrado.',
    index: 2
  },
  {
    state: '弱',
    pinyin: 'ruò',
    sensation: 'Frío en la base de la espalda, sabor metálico en la boca.',
    narrativeModel: 'El frasco está a un cuarto. Los dientes de Antonio están fríos y siente un deje de debilidad pasiva.',
    index: 3
  },
  {
    state: '枯竭',
    pinyin: 'kūjié',
    sensation: 'Dolor sordo en los huesos largos, temblor fino en las manos.',
    narrativeModel: 'El frasco de tinta del grimorio está casi vacío. A Antonio le tiemblan las manos al intentar sostener el libro.',
    index: 4
  },
  {
    state: '逆流',
    pinyin: 'nìliú',
    sensation: 'Ardor hirviente que sube por los brazos; la magia rechaza al usuario.',
    narrativeModel: 'La tinta negra del frasco hierve violentamente. Algo terrible y salvaje dentro de Antonio se rebela contra su cuerpo.',
    index: 5
  }
];

export interface ScarletThematicDamage {
  leve: string;
  moderado: string;
  severo: string;
}

export const SCARLET_DAMAGES: { [element: string]: ScarletThematicDamage } = {
  '火': {
    leve: 'Un calor súbito en la palma y olor a chamusquina seca en la nariz. La piel queda enrojecida.',
    moderado: 'Quemadura de 1.er grado en la mano derecha, sensible al menor tacto y cubierta de hollín.',
    severo: 'Quemadura severa de 2.º grado, ampolla dolorosa en los dedos que te impide empuñar armas por dos días.'
  },
  '水': {
    leve: 'Humedad fría y repentina en los zapatos, acompañada de un escalofrío breve que te eriza la nuca.',
    moderado: 'Tiritera incontrolable en los hombros, sensación de estar empapado hasta los huesos bajo la lluvia glacial.',
    severo: 'Fiebre alta repentina y temblores severos que te postran en la cama de la torre del castillo durante un día completo.'
  },
  '風': {
    leve: 'Un mareo súbito y leve vértigo por unos segundos, como si el suelo de Cauffen se inclinara.',
    moderado: 'Náuseas agudas y desequilibrio físico persistente. Te cuesta mantenerte erguido sin apoyarte.',
    severo: 'Desorientación espacial severa; el oído interno zumba y eres incapaz de caminar derecho o enfocar la vista.'
  },
  '光': {
    leve: 'Un dolor de cabeza punzante y destellos o manchas de color flotando en tu visión.',
    moderado: 'Dolor agudo detrás de los ojos, que lagrimean abundantemente y ven manchas incandescentes.',
    severo: 'Ceguera temporal completa que dura varios minutos, seguida de una intensa jaqueca residual.'
  },
  '土': {
    leve: 'Un peso repentino en los hombros y calambres leves en las pantorrillas.',
    moderado: 'Rigidez muscular dolorosa en la espalda y piernas, dificultando cualquier movimiento rápido.',
    severo: 'Un crujido sordo en los tobillos por exceso de carga gravitacional, dejándote cojeando y dolorido.'
  },
  '血': {
    leve: 'Un fuerte cosquilleo caliente en la yema de los dedos y una comezón inusual.',
    moderado: 'Sarpullido rojizo en las manos y antebrazos que arde con molestia constante.',
    severo: 'Hemorragia nasal profusa que mancha el grimorio, debilidad generalizada y palidez extrema.'
  },
  '骨': {
    leve: 'Un pinchazo sordo en las articulaciones de la mano con la que conjurabas.',
    moderado: 'Debilidad muscular severa en ambos brazos, impidiéndote levantar objetos medianos.',
    severo: 'Una dolorosa caída de presión, desmayo breve y entumecimiento rígido en las extremidades por horas.'
  },
  '思': {
    leve: 'Un murmullo de voces ininteligibles que causa un pitido leve en los oídos.',
    moderado: 'Zumbido constante e hipersensibilidad dolorosa al menor ruido en el castillo.',
    severo: 'Sordera temporal de varios minutos, acompañada de un dolor punzante en la sien.'
  },
  'default': {
    leve: 'Una sacudida incómoda recorre tu columna, dejándote un regusto amargo en la garganta.',
    moderado: 'Dolor ocular punzante y lagrimeo constante que empaña tu vista durante horas.',
    severo: 'Un desmayo fulminante de varios minutos y debilidad generalizada que te deja exhausto.'
  }
};

export interface RadicalItem {
  symbol: string;
  name: string;
  translation: string;
  description: string;
  associatedCharacters: string[];
}

export const RADICALS_DATA: RadicalItem[] = [
  {
    symbol: '氵',
    name: '三點水 (Sān Diǎn Shuǐ)',
    translation: 'Radical del Agua',
    description: 'El agua que fluye lateralmente. Representa fluidez, corrientes y los oleajes de Castemare.',
    associatedCharacters: ['水', '冰', '凍', '湧', '濤', '滅']
  },
  {
    symbol: '火 / 灬',
    name: '火 / 四點底 (Huǒ / Sì Diǎn Dǐ)',
    translation: 'Radical del Fuego',
    description: 'El fuego en su base o flamas ascendentes. Representa la energía térmica, calor destructivo y la combustión.',
    associatedCharacters: ['火', '燃', '爆', '烈', '熾', '煞']
  },
  {
    symbol: '气',
    name: '气字旁 (Qì Zì Páng)',
    translation: 'Radical del Aire/Aliento',
    description: 'El aliento de vida primordial, la atmósfera de Cauffen y el viento racheado.',
    associatedCharacters: ['風', '氣']
  },
  {
    symbol: '土 / 石',
    name: '土 / 石字旁 (Tǔ / Shí)',
    translation: 'Radical de la Tierra/Piedra',
    description: 'La roca maciza, los riscos escarpados y las murallas de piedra gris del castillo de Montenegro.',
    associatedCharacters: ['土', '重力', '岩']
  },
  {
    symbol: '月 / 骨',
    name: '肉 / 骨 (Ròu / Gǔ)',
    translation: 'Radical Orgánico/Cuerpo',
    description: 'Representa la carne, la estructura corporal y los fluidos biológicos del propio mago.',
    associatedCharacters: ['骨', '血', '魄']
  },
  {
    symbol: '心 / 忄',
    name: '心字旁 (Xīn Zì Páng)',
    translation: 'Radical de la Mente/Alma',
    description: 'El corazón y las actividades de la psique humana. Pensamientos, ideas y voluntades concentradas.',
    associatedCharacters: ['思', '意', '念', '感', '癒']
  }
];

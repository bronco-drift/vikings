import type { Scene } from './types'

/**
 * Grafo de escenas — año 750 EC.
 *
 * Anclajes históricos:
 * - 750: Caída de los Omeyas, fundación del Califato Abasí
 * - 750: Birka (Svealand) acaba de fundarse como emporio del Báltico
 * - Uppsala: centro del culto pagano nórdico (templo, túmulos, sacrificios cada 9 años)
 * - Ynglinga: dinastía sueca semilegendaria
 * - Hordaland: reino noruego pre-unificación (Harald Fairhair unirá Noruega en 872)
 * - Hetairoi: guardia escogida del Emperador bizantino (la Varangian Guard formal es del 988,
 *   pero noruegos servían como mercenarios bizantinos mucho antes)
 * - Khaganato Jázaro: élites convertidas al judaísmo (~740), capital Atil sobre el Volga
 * - Holmgard: nombre nórdico de Nóvgorod, primera capital de los Rus
 * - Mikelgardr (Miklagarðr): nombre nórdico de Constantinopla
 * - Sarkland: nombre nórdico de las tierras musulmanas
 * - Egberto de Wessex: licencia poética — el Egberto histórico reinó 802-839
 */
export const SCENES: Record<string, Scene> = {
  primer_pregunta: {
    id: 'primer_pregunta',
    art: 'upsala',
    region: 'norte',
    text:
      'Estás en Uppsala, año 750. Bajo los tres grandes túmulos de los reyes Yngling, frente al templo donde Odín, Thor y Frey reciben sacrificios cada nueve veranos. ' +
      'Eres karl libre con ansias de jarl. Tres reinos llaman: Noruega — sus jarls de Hordaland sueñan con saqueos al oeste; Svealand — los Yngling acaban de fundar Birka y miran al este, donde los ríos llevan al silver árabe de una nueva capital llamada Bagdad.',
    choices: [
      { label: 'Noruega', goto: 'noruega' },
      { label: 'Suecia', goto: 'suecia' },
      {
        label: 'Renunciar',
        result:
          'Algo te detiene. Quizás Odín te susurra otra senda — una donde la espada no es la única forma de no morir.',
        goto: 'camino_del_skald',
        requiresFlag: 'allEndingsDiscovered',
      },
    ],
  },

  // ============ RUTA OCCIDENTAL (Noruega) ============
  noruega: {
    id: 'noruega',
    art: 'mountain',
    region: 'oeste',
    rep: 0,
    text:
      'El rey de Hordaland comparte tus ideas. Te otorga 100 drakkars con dragones tallados en proa, y un Mjölnir de plata para colgar al cuello. ' +
      'Durante el viaje quedan perdidos en el mar del Norte — al amanecer ves dos rutas.',
    choices: [
      {
        label: 'Norte',
        rep: 3,
        result: 'Saqueás tres aldeas de las Shetland. 1000 marcos de plata. Tu nombre empieza a sonar entre los thralls.',
        goto: 'francia_inglaterra',
      },
      {
        label: 'Sur',
        rep: 1,
        result: 'Un saqueo modesto sobre la costa frisia: 500 marcos. Tus hombres murmuran que Tyr pidió más sangre.',
        goto: 'francia_inglaterra',
      },
    ],
  },

  francia_inglaterra: {
    id: 'francia_inglaterra',
    art: 'ocean',
    region: 'oeste',
    text:
      'Cruzás el Skagerrak con la flota cargada. Hacia el sur, dos reinos cristianos esperan: Francia, donde Pipino el Breve acaba de coronarse rey de los Francos; Inglaterra, donde el reino sajón de Wessex protege monasterios cargados de oro.',
    choices: [
      {
        label: 'Francia',
        rep: 2,
        result: 'Subís el Sena. París arde tres días. Los monjes huyen llorando con los relicarios.',
        goto: 'en_francia',
      },
      {
        label: 'Inglaterra',
        rep: 2,
        result: 'Cruzás el canal y golpeás Wessex de noche. Los thegns sajones huyen al bosque.',
        goto: 'en_inglaterra',
      },
    ],
  },

  en_francia: {
    id: 'en_francia',
    art: 'castle',
    region: 'oeste',
    rep: 1,
    text:
      'Tus hombres están exhaustos pero ricos. ¿Volvés a Escandinavia con el botín como hizo Ragnar antes que vos, o te asentás en estas tierras fértiles de Neustria — como harán siglos después los normandos de Rollo?',
    choices: [
      {
        label: 'Escandinavia',
        rep: 1,
        result: 'El camino a casa es largo. Los skalds ya empiezan a cantar tu nombre en los longhouses.',
        goto: 'escandinavia',
      },
      {
        label: 'Asentamiento',
        rep: 2,
        result: 'Levantás un campamento permanente cerca del Sena. Los francos locales no están contentos.',
        goto: 'asentamiento',
      },
    ],
  },

  en_inglaterra: {
    id: 'en_inglaterra',
    art: 'castle',
    region: 'oeste',
    rep: 1,
    text:
      'El Rey Egberto de Wessex aparece con escolta y una propuesta: alianza, no destrucción. Su corte es civilizada — escribas, monjes, salmos en latín. Una cruz cuelga en el salón donde antes hubo runas.',
    choices: [
      {
        label: 'Aliados',
        rep: 0,
        result: 'Aceptás la mano de Egberto. Banquetes, diplomacia, y cierta vergüenza de tus dioses paganos.',
        goto: 'aliado_egberto',
      },
      {
        label: 'Asesinar',
        rep: 3,
        result: 'En el banquete clavás tu daga bajo la mesa. Odín lo aprueba. Los monjes huyen al bosque rezando a su Cristo.',
        goto: 'asesinar_egberto',
      },
    ],
  },

  aliado_egberto: {
    id: 'aliado_egberto',
    art: 'castle',
    region: 'oeste',
    rep: 0,
    text:
      'Como aliado de Egberto aprendés el reino por dentro. El obispo te ofrece bautismo. Tus hombres se ponen incómodos cuando rezás en latín. La sed de gloria no te deja en paz.',
    choices: [
      {
        label: 'Asentamiento',
        rep: 0,
        result: 'Renunciás a tus aspiraciones. Levantás un campamento neutral entre Wessex y Mercia.',
        goto: 'asentamiento',
      },
      {
        label: 'Escandinavia',
        rep: 2,
        result: 'Volvés al norte con conocimiento del enemigo. Tu pueblo te recibe como un Odín que volvió de los muertos.',
        goto: 'escandinavia',
      },
    ],
  },

  asesinar_egberto: {
    id: 'asesinar_egberto',
    art: 'battle',
    region: 'oeste',
    rep: 2,
    text:
      'Egberto cae bajo tu daga. Wessex queda sin rey. Pero los thegns sajones susurran contra vos en cada salón; tu ascendencia no es de Wodan ni de Cerdic. La corona de Wessex parece una invitación al cuchillo. ' +
      'Hacia el norte, en cambio, Northumbria — la tierra de Lindisfarne — está mal defendida y rica en monasterios.',
    choices: [
      {
        label: 'Wessex',
        rep: -3,
        result:
          'Aceptás la corona. En tu coronación, tres thegns te emboscan en el atrio de la iglesia. Caes peleando — pero caes por orgullo. ' +
          'El Padre de la Espada te recibe: morir con acero en mano vale más que mil coronas.',
        goto: 'muerte_digna',
      },
      {
        label: 'Northumbria',
        rep: 3,
        result: 'Tomás Eoforwic (la futura Jorvik) sin un solo asedio. Los earls locales se arrodillan.',
        goto: 'northumbria',
      },
    ],
  },

  northumbria: {
    id: 'northumbria',
    art: 'castle',
    region: 'oeste',
    rep: 2,
    text:
      'Controlás Eoforwic y casi toda Northumbria. Podés coronarte rey de un pueblo cristiano que no es el tuyo, o cruzar de vuelta el mar y unificar Escandinavia bajo un solo trono — algo que ningún rey ha logrado.',
    choices: [
      {
        label: 'Rey de Inglaterra',
        rep: 0,
        result: 'Te coronan en York. El obispo te unge con óleo. Un trono ajeno, pero un trono.',
        goto: 'rey_inglaterra',
      },
      {
        label: 'Rey Vikingo',
        rep: 3,
        result: 'Cruzás el Mar del Norte de vuelta. Tu objetivo no era una isla — eran todas las tierras del norte.',
        goto: 'rey_vikingo',
      },
    ],
  },

  escandinavia: {
    id: 'escandinavia',
    art: 'mountain',
    region: 'norte',
    rep: 2,
    text:
      'De vuelta en tierras nórdicas con riquezas y fama. Heidaby — el gran emporio danés — te recibe con honor. Podés pelear por Kattegat (el estrecho entre Dinamarca y Svealand) o ir directo por la corona de toda Escandinavia, como soñaron los Yngling.',
    choices: [
      {
        label: 'Kattegat',
        rep: 2,
        result: 'Te recibe el jarl de Kattegat. Te insulta antes incluso de saludarte.',
        goto: 'kategat',
      },
      {
        label: 'Rey de Escandinavia',
        rep: 3,
        result: 'Convocás a todos los jarls. Vas por todo.',
        goto: 'rey_vikingo',
      },
    ],
  },

  asentamiento: {
    id: 'asentamiento',
    art: 'farm',
    region: 'oeste',
    rep: 1,
    text:
      'El asentamiento crece. Los locales no se rebelan: te miran con sonrisas que no llegan a los ojos, y desaparecen del pueblo de a dos. Algo se cocina en las sombras de la abadía.',
    choices: [
      {
        label: 'Asesinar a todos',
        rep: 3,
        result: 'Antes de que conspiren, ordenás la matanza. Tu pueblo te aclama; los sobrevivientes te miran con odio puro.',
        goto: 'asesinar',
      },
      {
        label: 'Negociar',
        rep: -1,
        result: 'Convocás a los líderes locales. Te reciben con vino, abrazos y un pacto firmado bajo crucifijo.',
        goto: 'negociar',
      },
    ],
  },

  negociar: {
    id: 'negociar',
    art: 'castle',
    region: 'oeste',
    rep: 0,
    text:
      'Los locales te ofrecen gobernar juntos: un consejo dual, un trono compartido. Suena demasiado bien. Mientras hablan, notás que sus guardias están demasiado cerca y demasiado armados. Una cruz de oro reluce contra tu pecho desnudo — no es regalo, es marca.',
    choices: [
      {
        label: 'Gobernar juntos',
        rep: -10,
        result:
          'Aceptás el trono. La primera noche, durante el banquete, los guardias se acercan por la espalda. Mueres sin espada en la mano. ' +
          'Hel — diosa del bajomundo nórdico — abre sus puertas grises. No hay Valhalla para quien confió en el enemigo. Tu nombre se borra de las sagas.',
        goto: 'muerte_indigna',
      },
      {
        label: 'Volver al norte',
        rep: 2,
        result: 'Olfateás la trampa. Levantás campamento esa noche y zarpás antes del amanecer.',
        goto: 'escandinavia',
      },
    ],
  },

  asesinar: {
    id: 'asesinar',
    art: 'battle',
    region: 'oeste',
    rep: 2,
    text:
      'Matás a cualquier local que cruce tu camino. Los pocos sobrevivientes huyen al sur. Estás solo con tu pueblo en tierra arrasada — sin súbditos. ¿Reinás sobre las cenizas, o volvés al hogar antes del invierno?',
    choices: [
      {
        label: 'Gobernar las cenizas',
        rep: -10,
        result:
          'Te quedás. Sin súbditos no hay reino, sin cosecha no hay invierno. Tus hombres se vuelven contra vos antes de la primera nevada. ' +
          'Morís de hambre en tu trono de madera. Una muerte indigna de cualquier hijo de Odín.',
        goto: 'muerte_indigna',
      },
      {
        label: 'Escandinavia',
        rep: 2,
        result: 'Cargás los drakkars con el saqueo, prendés fuego a lo que queda y zarpás al norte.',
        goto: 'escandinavia',
      },
    ],
  },

  kategat: {
    id: 'kategat',
    art: 'battle',
    region: 'norte',
    rep: 0,
    text:
      'El jarl de Kattegat te reta a holmgang — el duelo formal sobre un islote. Parece frágil, pero al desenvainar, su mano no tiembla. Quizás no estás viendo lo que querés ver. Mientras tanto, un cuervo trae noticias: ha muerto el Rey de Wessex en Inglaterra. Northumbria está sin guarnición.',
    choices: [
      {
        label: 'Pelear el holmgang',
        rep: 5,
        result:
          'Peleás como un berserker poseído por Odín. Pero el viejo era un veterano disfrazado de débil — fue Hirðmaðr del rey anterior. Caes en el último golpe. ' +
          'Los hombres alrededor del círculo levantan sus hachas: moriste como vikingo. Las Valquirias bajan a buscarte.',
        goto: 'muerte_digna',
      },
      {
        label: 'Cruzar a Inglaterra',
        rep: 1,
        result: 'Dejás a Kattegat para otra vida. El trono inglés vacante te llama más fuerte.',
        goto: 'northumbria',
      },
    ],
  },

  rey_vikingo: {
    id: 'rey_vikingo',
    art: 'battle',
    region: 'oeste',
    rep: 3,
    text:
      'Vas por la gloria total — lo que ningún rey escandinavo ha logrado todavía (Harald Fairhair lo hará recién en 872, pero vos vivís en el 750). ¿A quién atacás primero?',
    choices: [
      {
        label: 'Dinamarca',
        rep: 0,
        result: 'Dinamarca cae en dos veranos. Los daneses se llaman a sí mismos "los hombres del norte" — pero ahora son tus hombres del norte.',
        goto: 'leyenda_vikinga',
      },
      {
        label: 'Noruega',
        rep: 0,
        result: 'Noruega resiste un invierno, después se arrodilla. Hordaland, Vestfold, Trøndelag — todos los jarls juran fealdad.',
        goto: 'leyenda_vikinga',
      },
    ],
  },

  // ============ RUTA ORIENTAL (Suecia) — VARANGOS, RUS, SARKLAND ============
  suecia: {
    id: 'suecia',
    art: 'castle',
    region: 'oriente',
    rep: 0,
    text:
      'El rey Yngling vive en Birka — el emporio que acaba de fundar en el lago Mälaren. Es medio ortiva, pero huele el dirham árabe que cruza desde Atil. ' +
      'Te da 50 knarrs cargados de pieles de marta y ámbar báltico. Durante el viaje al Báltico oriental, dos rutas: por el norte (más larga, segura) o por el sur (corta pero traicionera).',
    choices: [
      {
        label: 'Norte',
        rep: 3,
        result: 'Llegás al Neva, después a Aldeigjuborg (la futura Ladoga). Los eslavos te llaman "Varangos" — los hombres del juramento.',
        goto: 'ruta_oriental',
      },
      {
        label: 'Sur',
        rep: -3,
        result: 'Te perdés entre las islas estonias. Tormenta, naufragio, hombres ahogados. Volvés con un solo knarr y ningún honor.',
        goto: 'pelea_o_regresa',
      },
    ],
  },

  pelea_o_regresa: {
    id: 'pelea_o_regresa',
    art: 'farm',
    region: 'norte',
    text:
      'Ya nadie te cree en Birka. Podés intentar redimirte peleando contra el Yngling — un hombre sagrado, descendiente de Frey — o aceptar tu derrota y volver a Uppsala a trabajar la tierra como tu padre.',
    choices: [
      {
        label: 'Pelear',
        rep: 5,
        result: 'Le ganaste al Yngling en holmgang. Los nobles svealandes te dan otra flota. Esta vez al este, hacia los Varangos.',
        goto: 'ruta_oriental',
      },
      {
        label: 'Aceptar derrota',
        rep: -1,
        result: 'Volvés a Uppsala. Plantás cebada, sacrificás un caballo cada otoño, criás siete hijos. Una vida sin gloria, pero larga. Pocos vikingos llegan a esto.',
        goto: 'vida_humilde',
      },
    ],
  },

  ruta_oriental: {
    id: 'ruta_oriental',
    art: 'ocean',
    region: 'oriente',
    rep: 1,
    text:
      'Aldeigjuborg te recibe — los eslavos llaman "Rus" a los como vos, y "Sarkland" a las tierras musulmanas. Tres caminos se abren: el Dniéper baja a Mikelgardr (Constantinopla); el Volga lleva a Atil, capital del Khaganato Jázaro; o podés frenar acá y fundar Holmgard sobre el Volkhov.',
    choices: [
      {
        label: 'Dniéper a Mikelgardr',
        rep: 2,
        result: 'Bajás el Dniéper, cargás los knarrs a hombros por los rápidos. El Bósforo aparece.',
        goto: 'bizancio',
      },
      {
        label: 'Volga a Atil',
        rep: 2,
        result: 'El Volga es el camino del silver. Atil — capital jázara — aparece en el delta del Caspio.',
        goto: 'volga',
      },
      {
        label: 'Fundar Holmgard',
        rep: 1,
        result: 'Levantás empalizada de roble sobre el Volkhov. Los eslavos te aceptan como gobernador.',
        goto: 'kiev',
      },
    ],
  },

  bizancio: {
    id: 'bizancio',
    art: 'castle',
    region: 'oriente',
    rep: 0,
    text:
      'Mikelgardr — los griegos la llaman Constantinopla — es más grande que cualquier ciudad nórdica. Las murallas Teodosianas tienen 300 años. El Emperador, con púrpura imperial, manda decir que escuchó de vos. Te ofrece dos rutas: asaltar la Reina de Ciudades como hicieron otros Rus, o servirle como Hetairoi — la guardia escogida del trono.',
    choices: [
      {
        label: 'Asaltar la ciudad',
        rep: 4,
        result:
          'Tu hueste choca contra las Teodosianas. Aceite hirviendo, fuego griego que arde sobre el agua, ballestas masivas. Caes con el hacha en alto frente al Bósforo. ' +
          'Odín te abre las puertas — atacar lo imposible es de héroe.',
        goto: 'muerte_digna',
      },
      {
        label: 'Servir al Emperador',
        rep: 3,
        result: 'Jurás lealtad en griego ante el trono purpúreo. Te volvés Hetairoi: hacha en mano, leal al púrpura. Años de batallas en Anatolia, Sicilia, el Cáucaso.',
        goto: 'leyenda_oriental',
      },
    ],
  },

  volga: {
    id: 'volga',
    art: 'volga',
    region: 'oriente',
    rep: 1,
    text:
      'Bajás el Volga durante semanas. Los Rus que viajan con vos cantan a Frey por las noches. Llegás a Atil, capital del Khaganato Jázaro. ' +
      'Los jázaros son raros: el khagan y sus nobles se convirtieron al judaísmo hace una década. Te miran las botas y te ofrecen dos caminos: servir en la guardia personal del khagan, o cargar dirhams abasíes y seguir hasta Bagdad, que acaban de fundar.',
    choices: [
      {
        label: 'Servir al Khagan',
        rep: 2,
        result: 'Jurás bajo la Torá ante el khagan. Te casan con una hija de un bek jázaro. Aprendés hebreo entre comerciantes.',
        goto: 'khagan_jazaro',
      },
      {
        label: 'Seguir a Bagdad',
        rep: 2,
        result: 'Cargás los knarrs con dirhams de plata pura y bajás el Caspio hasta el Tigris.',
        goto: 'bagdad',
      },
    ],
  },

  bagdad: {
    id: 'bagdad',
    art: 'bagdad',
    region: 'oriente',
    rep: 1,
    text:
      'Bagdad — Madinat as-Salam, la Ciudad de la Paz — fue fundada hace pocos años por Al-Mansur, el nuevo califa abasí. Las cúpulas reflejan oro, las fuentes corren con agua perfumada. El califa escucha de la llegada de un "rus de los bárbaros del norte". Te ofrece dos caminos: convertirte al Islam y aceptar palacio, esposas y rango; o tomar lo que puedas y zarpar antes del amanecer.',
    choices: [
      {
        label: 'Convertirse al Islam',
        rep: -2,
        result:
          'Decís la shahada. Te llaman ahora "Yusuf ibn al-Rus". Te dan harem, palacio en el barrio cristiano, esclavos cristianos y eslavos. ' +
          'Tus dioses nórdicos no llegan tan al sur. El Valhalla te cierra las puertas — pero el Paraíso musulmán quizás te abre las suyas.',
        goto: 'vikingo_musulman',
      },
      {
        label: 'Robar y huir',
        rep: 5,
        result: 'Saqueás el barrio comercial al amanecer. Quince knarrs llenos de dirhams. La caravana de la guardia no te alcanza. Volvés al norte como una leyenda.',
        goto: 'escandinavia',
      },
    ],
  },

  kiev: {
    id: 'kiev',
    art: 'kiev',
    region: 'oriente',
    rep: 1,
    text:
      'Holmgard crece. Los eslavos — Rus, como te empiezan a llamar — te aceptan como gobernador. Más al sur, sobre una colina del Dniéper, hay un sitio mejor para una capital: lo llamarán "Kænugarðr" — Kiev, en el habla local. ' +
      'Tu hijo nacerá acá. ¿Plantás tu dinastía en este suelo eslavo o seguís el Dniéper hasta el púrpura imperial?',
    choices: [
      {
        label: 'Fundar la dinastía',
        rep: 4,
        result:
          'Te quedás. Tu hijo se llama Hroerikr — los eslavos dirán "Rurik". Su tataranieto fundará el principado de Kiev. ' +
          'Tus descendientes regirán los ríos rusos durante setecientos años, hasta el último gran príncipe.',
        goto: 'dinastia_rus',
      },
      {
        label: 'Seguir al Bósforo',
        rep: 2,
        result: 'Dejás Holmgard a tu hermano. Bajás el Dniéper. Mikelgardr brilla en la línea del horizonte.',
        goto: 'bizancio',
      },
    ],
  },

  // ============ CAMINO SECRETO: EL SKALD ============
  camino_del_skald: {
    id: 'camino_del_skald',
    art: 'skald',
    region: 'skald',
    rep: 3,
    text:
      'Te quedás en Uppsala. Renunciás a drakkars y a saqueos. Te volvés errante entre las cortes — Birka, Heidaby, Kaupang, Uppsala. Aprendés la métrica dróttkvætt bajo los maestros de la corte de Ynglinga. ' +
      'Tu memoria almacena las gestas de mil guerreros muertos, y empezás a versificarlas tú mismo.',
    choices: [
      {
        label: 'Componer las grandes sagas',
        rep: 5,
        result:
          'Empezás con la "Saga de Ragnar". Después el "Heimskringla" sobre los reyes. Las Eddas comenzás a darles forma. ' +
          'Ningún rey te paga porque no se lo pedís — te alimentás de la admiración de los thrall y los karl que escuchan.',
        goto: 'el_skald',
      },
    ],
  },

  // ============ FINALES ============
  leyenda_vikinga: {
    id: 'leyenda_vikinga',
    art: 'valhalla',
    region: 'valhalla',
    rep: 5,
    ending: 'glory',
    text:
      'Te coronaste rey de Dinamarca, Noruega y Svealand — el primero que une las tres coronas, 122 años antes de Harald Fairhair. ' +
      'Los skalds futuros mezclarán tu nombre con el de Ragnar Lothbrok hasta que nadie sepa cuál fue real. Tu sangre corre por los reyes daneses durante diez siglos.',
    choices: [],
  },

  leyenda_oriental: {
    id: 'leyenda_oriental',
    art: 'valhalla',
    region: 'valhalla',
    rep: 5,
    ending: 'glory',
    text:
      'Cuarenta años después volvés a Birka cargado de seda china, oro armenio, marfil etíope y cicatrices. Fundás un linaje de Hetairoi. ' +
      'En las sagas te conocerán como "El Varangos" — el rus que sirvió al púrpura y volvió. Los emperadores bizantinos seguirán reclutando vikingos por tu causa durante 250 años más, hasta los normandos.',
    choices: [],
  },

  dinastia_rus: {
    id: 'dinastia_rus',
    art: 'kiev',
    region: 'valhalla',
    rep: 5,
    ending: 'kingdom',
    text:
      'Hroerikr — tu hijo — funda lo que la historia llamará "Rus de Kiev". Sus descendientes serán bautizados en 988 por la princesa Olga. Iván el Terrible, Pedro el Grande, los Romanov — todos te llevarán en la sangre. ' +
      'No vas al Valhalla — morís en cama, rodeado de nietos eslavos — pero hay zares que rezan a Cristo y no saben que su tataraputo te invocaba a Odín.',
    choices: [],
  },

  khagan_jazaro: {
    id: 'khagan_jazaro',
    art: 'castle',
    region: 'oriente',
    rep: 3,
    ending: 'kingdom',
    text:
      'Serviste al khagan judío durante treinta años. Aprendiste hebreo y árabe. Comerciaste seda china por dirhams abasíes. Te casaste con tres mujeres, todas hijas de beks jázaros. ' +
      'Morís rico en Atil. Tus dioses nórdicos no llegan al delta del Caspio — pero tu tumba mira al norte, por las dudas.',
    choices: [],
  },

  rey_inglaterra: {
    id: 'rey_inglaterra',
    art: 'castle',
    region: 'oeste',
    rep: 1,
    ending: 'kingdom',
    text:
      'Sos rey de Northumbria y Wessex. Te coronaron con óleo cristiano. Pasarás tus últimos días odiándote por no haber regresado a Uppsala. Pero algo es algo: rey sos, aunque sea de cristianos.',
    choices: [],
  },

  vida_humilde: {
    id: 'vida_humilde',
    art: 'farm',
    region: 'norte',
    rep: 5,
    ending: 'kingdom',
    text:
      'Vives ochenta años — una eternidad para tu época. Tus nietos te llaman "afi", no jarl. No hay skalds para vos. Pero hay siete hijos, cosecha buena la mayoría de los años, y un atardecer cualquiera de tu casa donde te das cuenta de que pocos vikingos viven para ver canas.',
    choices: [],
  },

  muerte_digna: {
    id: 'muerte_digna',
    art: 'valhalla',
    region: 'valhalla',
    rep: 3,
    ending: 'glory',
    text:
      'Las Valquirias bajan a buscarte. Odín, Thor y Frey te reciben en el Valhalla con cuernos de hidromiel. Comerás con los einherjar — los héroes — hasta el Ragnarök, cuando peleés tu última batalla junto a Odín contra el lobo Fenrir.',
    choices: [],
  },

  vikingo_musulman: {
    id: 'vikingo_musulman',
    art: 'bagdad',
    region: 'shame',
    rep: -1,
    ending: 'shame',
    text:
      'Te llaman Yusuf ibn al-Rus. Tu nombre nórdico se borra de las sagas — ningún skald canta al apóstata. Vivís cómodo entre cojines de seda, harem, dátiles, pozos perfumados. ' +
      'Cuando morís, no sabés a qué cielo vas: el Valhalla te cerró las puertas, pero quizás Allah te abre las suyas. Tu tumba lleva tu nombre árabe — el verdadero ya nadie lo recuerda.',
    choices: [],
  },

  muerte_indigna: {
    id: 'muerte_indigna',
    art: 'shame',
    region: 'shame',
    rep: -3,
    ending: 'shame',
    text:
      'Tu cuerpo se pudre sin tumba. Hel te recibe en su salón gris — no es el infierno cristiano, pero tampoco es el Valhalla. Es el aburrimiento eterno reservado a quienes mueren sin espada. Los dioses paganos no te quieren; el dios cristiano tampoco. Tu nombre se desvanece de las sagas en una generación.',
    choices: [],
  },

  el_skald: {
    id: 'el_skald',
    art: 'skald',
    region: 'valhalla',
    rep: 10,
    ending: 'glory',
    text:
      'Te volvés Bragi el Viejo — el primer skald cuyo nombre la historia recordará. Tus versos sobreviven mil doscientos años. Las Eddas que compusiste — Odín colgado del Yggdrasil, Thor cruzando los ríos, Ragnarök — son las que la gente del futuro leerá. ' +
      'No tenés tumba real, no tenés tierra, no tenés corona. Pero cada vez que alguien dice "Ragnar Lothbrok", "Valhalla", "berserker" — estás hablando vos. Las palabras vencieron a la espada.',
    choices: [],
  },
}

export const START_SCENE = 'primer_pregunta'

/** Lista de finales para mostrar progreso/legend en el Intro. */
export const ENDINGS = [
  { id: 'leyenda_vikinga', label: 'La Leyenda Vikinga', tone: 'glory' },
  { id: 'leyenda_oriental', label: 'El Varangos', tone: 'glory' },
  { id: 'dinastia_rus', label: 'Padre de los Rus', tone: 'kingdom' },
  { id: 'khagan_jazaro', label: 'Guardia del Khagan', tone: 'kingdom' },
  { id: 'muerte_digna', label: 'Valhalla', tone: 'glory' },
  { id: 'rey_inglaterra', label: 'Rey Extranjero', tone: 'kingdom' },
  { id: 'vida_humilde', label: 'Vida Humilde', tone: 'kingdom' },
  { id: 'vikingo_musulman', label: 'Yusuf el Apóstata', tone: 'shame' },
  { id: 'muerte_indigna', label: 'Hel', tone: 'shame' },
  { id: 'el_skald', label: 'Bragi el Viejo ★', tone: 'glory', secret: true },
] as const

/** IDs de los finales canónicos que cuentan para desbloquear el secreto. */
export const CANONICAL_ENDINGS = [
  'leyenda_vikinga',
  'leyenda_oriental',
  'dinastia_rus',
  'khagan_jazaro',
  'muerte_digna',
  'rey_inglaterra',
  'vida_humilde',
  'vikingo_musulman',
  'muerte_indigna',
] as const

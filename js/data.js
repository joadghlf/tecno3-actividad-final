var GAME_DATA = {
    title: 'Decisiones que cuidan',
    subtitle: 'Primeros auxilios en la vida cotidiana',

    intro: {
        lead: 'Recorrerás cinco misiones para repasar lo aprendido en el curso. Cada misión propone un desafío distinto: clasificar, ordenar, identificar riesgos y tomar decisiones seguras.',
        goals: [
            'Repasar conceptos de primeros auxilios, urgencia y emergencia.',
            'Practicar la regla PAS en situaciones cotidianas.',
            'Tomar decisiones con retroalimentación inmediata.',
            'Reflexionar sobre tu proceso de aprendizaje.'
        ],
        notice: 'Este juego permite repasar decisiones iniciales de primeros auxilios. No reemplaza la asistencia profesional, médica, de bomberos ni del sistema de emergencias.',
        cta: 'Comenzar recorrido'
    },

    badges: [
        {
            id: 'observer',
            label: 'Observador/a',
            desc: 'Completaste las primeras misiones reconociendo riesgos y conceptos.',
            unlockAfter: 2,
            icon: 'eye'
        },
        {
            id: 'activator',
            label: 'Activador/a de ayuda',
            desc: 'Dominaste la cadena PAS y la activación del sistema de emergencias.',
            unlockAfter: 4,
            icon: 'phone'
        },
        {
            id: 'companion',
            label: 'Acompañante seguro/a',
            desc: 'Finalizaste el recorrido completo con decisiones responsables.',
            unlockAfter: 5,
            icon: 'heart'
        }
    ],

    debrief: {
        scoreThresholds: { high: 75, mid: 45 },
        scoreMessages: {
            high: 'Excelente recorrido. Tus decisiones priorizaron la seguridad, la activación de ayuda y el acompañamiento responsable.',
            mid: 'Buen trabajo. Repasaste los contenidos centrales y reconociste varias acciones seguras. Podés reintentar para reforzar PAS.',
            low: 'Completaste el recorrido y eso ya es un avance. Te recomendamos revisar las ideas clave y volver a practicar las misiones.'
        }
    },

    missions: [
        {
            id: 1,
            title: 'Conceptos esenciales',
            description: 'Primeros auxilios, urgencia y emergencia.',
            mechanic: 'Clasificador en movimiento',
            statusLabel: 'Disponible'
        },
        {
            id: 2,
            title: 'Preparación y prevención',
            description: 'Botiquín y riesgos evitables en la vida cotidiana.',
            mechanic: 'Botiquín express + radar de riesgos',
            statusLabel: 'Disponible'
        },
        {
            id: 3,
            title: 'La regla PAS',
            description: 'Proteger, Avisar y Socorrer en el orden correcto.',
            mechanic: 'Cadena PAS + clasificador de acciones',
            statusLabel: 'Disponible'
        },
        {
            id: 4,
            title: 'Escena crítica',
            description: 'Evaluar la escena y activar ayuda a tiempo.',
            mechanic: 'Escena del club + central de ayuda',
            statusLabel: 'Disponible'
        },
        {
            id: 5,
            title: 'Decisión final',
            description: 'Caso integrador en el club comunitario.',
            mechanic: 'Simulador de decisiones PAS',
            statusLabel: 'Disponible'
        }
    ],

    pas: [
        { letter: 'P', name: 'Proteger', hint: 'Observar la escena y reducir riesgos.' },
        { letter: 'A', name: 'Avisar', hint: 'Pedir ayuda con información clara.' },
        { letter: 'S', name: 'Socorrer', hint: 'Acompañar sin exponerse ni improvisar.' }
    ],

    mission1: {
        concepts: [
            {
                id: 'fa',
                title: 'Primeros auxilios',
                text: 'Son las acciones inmediatas y básicas que una persona puede realizar mientras llega ayuda profesional.'
            },
            {
                id: 'urg',
                title: 'Urgencia',
                text: 'Requiere atención médica, pero la persona suele estar consciente y estable en el momento.'
            },
            {
                id: 'eme',
                title: 'Emergencia',
                text: 'Pone en riesgo la vida o la integridad. Hay que activar el sistema de emergencias de inmediato.'
            }
        ],
        situations: [
            {
                title: 'Corte en el dedo',
                text: 'Un niño se corta cocinando. Sangra, pero está consciente y responde.',
                type: 'urgencia',
                feedback: 'Correcto: necesita atención, pero no hay riesgo vital inmediato si se controla la herida.'
            },
            {
                title: 'Persona desvanecida',
                text: 'En la plaza, una persona cae al suelo y no responde cuando la llamás.',
                type: 'emergencia',
                feedback: 'Correcto: una persona que no responde es una emergencia. Activá ayuda y evaluá la escena.'
            },
            {
                title: 'Tobillo hinchado',
                text: 'Alguien tropieza en el club. Duele mucho el tobillo, pero habla con claridad.',
                type: 'urgencia',
                feedback: 'Correcto: hay lesión, pero la persona está consciente. Conviene pedir ayuda médica sin dramatizar.'
            },
            {
                title: 'Humo en una cocina',
                text: 'Ves humo salir de una casa y escuchás tos adentro.',
                type: 'emergencia',
                feedback: 'Correcto: humo y personas en riesgo implican emergencia. Protegé la escena y avisá de inmediato.'
            },
            {
                title: 'Dolor de cabeza fuerte',
                text: 'Un vecino tiene migraña intensa desde hace horas, pero está despierto y orientado.',
                type: 'urgencia',
                feedback: 'Correcto: requiere evaluación médica, pero no es necesariamente una emergencia vital inmediata.'
            },
            {
                title: 'Botella rota y caída',
                text: 'Una persona cae junto a vidrios rotos y queda mareada, sin levantarse sola.',
                type: 'emergencia',
                feedback: 'Correcto: caída, posible lesión y alteración del estado. Protegé, avisá y no la muevas sin evaluar.'
            }
        ]
    },

    mission2: {
        kitItems: [
            { id: 'gasas', label: 'Gasas estériles', correct: true },
            { id: 'vendas', label: 'Vendas elásticas', correct: true },
            { id: 'curitas', label: 'Curitas / apósitos', correct: true },
            { id: 'guantes', label: 'Guantes descartables', correct: true },
            { id: 'tijera', label: 'Tijera de punta redonda', correct: true },
            { id: 'alcohol', label: 'Alcohol en gel', correct: true },
            { id: 'martillo', label: 'Martillo', correct: false },
            { id: 'pastillas', label: 'Pastillas sueltas', correct: false },
            { id: 'comida', label: 'Snack vencido', correct: false },
            { id: 'perfume', label: 'Perfume', correct: false }
        ],
        kitRequired: 6,
        risks: [
            {
                id: 'vereda',
                label: 'Vereda rota cerca de la plaza',
                shortName: 'Vereda rota',
                hint: 'Puede provocar caídas, especialmente de personas mayores.',
                visual: 'vereda',
                clue: 'Baldosas levantadas en el piso'
            },
            {
                id: 'cable',
                label: 'Cable eléctrico suelto',
                shortName: 'Cable suelto',
                hint: 'Riesgo de electrocución si hay humedad cerca.',
                visual: 'cable',
                clue: 'Cable colgando cerca del suelo'
            },
            {
                id: 'mojado',
                label: 'Piso mojado sin señal',
                shortName: 'Piso mojado',
                hint: 'Superficie resbaladiza sin cartel de advertencia.',
                visual: 'mojado',
                clue: 'Charco sin cartel de advertencia'
            }
        ]
    },

    mission3: {
        steps: [
            {
                id: 'p',
                order: 1,
                letter: 'P',
                title: 'Proteger',
                text: 'Observá la escena y reducí riesgos para vos, la víctima y quienes están cerca.'
            },
            {
                id: 'a',
                order: 2,
                letter: 'A',
                title: 'Avisar',
                text: 'Pedí ayuda y activá el sistema de emergencias con información clara.'
            },
            {
                id: 's',
                order: 3,
                letter: 'S',
                title: 'Socorrer',
                text: 'Acompañá dentro de tus posibilidades, sin maniobras que no conozcas.'
            }
        ],
        actions: [
            { id: 'a1', text: 'Señalizar la botella rota sin tocala', zone: 'p' },
            { id: 'a2', text: 'Verificar si hay más riesgos en la escena', zone: 'p' },
            { id: 'a3', text: 'Pedir a una persona concreta que llame al 911', zone: 'a' },
            { id: 'a4', text: 'Indicar ubicación exacta y qué ocurrió', zone: 'a' },
            { id: 'a5', text: 'Hablarle con calma mientras llega ayuda', zone: 's' },
            { id: 'a6', text: 'Observar si la persona responde o se mueve', zone: 's' },
            { id: 'a7', text: 'Levantarla rápido para sentarla', zone: 'avoid' },
            { id: 'a8', text: 'Dar agua o medicación', zone: 'avoid' }
        ],
        zones: [
            { id: 'p', label: 'Proteger', color: 'teal' },
            { id: 'a', label: 'Avisar', color: 'blue' },
            { id: 's', label: 'Socorrer', color: 'green' },
            { id: 'avoid', label: 'Evitar', color: 'red' }
        ]
    },

    mission4: {
        sceneRisks: [
            {
                id: 'botella',
                label: 'Botella rota cerca de la víctima',
                shortName: 'Vidrio roto',
                hint: 'Vidrio puede cortar a la víctima o a quien se acerque.',
                visual: 'bottle',
                clue: 'Objeto cortante en el piso'
            },
            {
                id: 'silla',
                label: 'Silla caída en el paso',
                shortName: 'Silla caída',
                hint: 'Obstáculo que dificulta el acceso seguro.',
                visual: 'chair',
                clue: 'Obstáculo en el camino'
            },
            {
                id: 'multitud',
                label: 'Multitud muy cerca',
                shortName: 'Gente nerviosa',
                hint: 'Varias personas nerviosas pueden estorbar o empeorar la escena.',
                visual: 'crowd',
                clue: 'Personas muy cerca de la víctima'
            }
        ],
        callInfo: [
            { id: 'lugar', label: 'Lugar exacto', example: 'Club San Martín, salón principal' },
            { id: 'que', label: 'Qué pasó', example: 'Persona caída, mareada tras tropiezo' },
            { id: 'cuantos', label: 'Cuántas personas', example: 'Una persona afectada' },
            { id: 'estado', label: 'Estado general', example: 'Consciente pero mareada' },
            { id: 'riesgos', label: 'Riesgos en escena', example: 'Vidrio roto y silla caída' }
        ],
        people: [
            {
                id: 'ana',
                name: 'Ana',
                role: 'Está calmada y con el celular en mano',
                correct: true,
                feedback: 'Correcto: elegiste a alguien disponible, con calma y con teléfono.'
            },
            {
                id: 'luis',
                name: 'Luis',
                role: 'Está muy nervioso y no deja de gritar',
                correct: false,
                feedback: 'En una emergencia conviene asignar a alguien que pueda seguir instrucciones con claridad.'
            },
            {
                id: 'todos',
                name: 'Todos a la vez',
                role: 'Gritar "que alguien llame" sin mirar a nadie',
                correct: false,
                feedback: 'Gritar sin asignar suele ser menos efectivo. Mirá a una persona y pedile la tarea concreta.'
            }
        ],
        finalChoices: [
            {
                text: 'Acompaño a la persona, hablo con calma y evito moverla.',
                type: 'safe',
                points: 3,
                feedback: 'Muy bien. Socorrer es acompañar y observar, no improvisar maniobras.'
            },
            {
                text: 'La levanto entre varias personas para que se siente.',
                type: 'risk',
                points: 0,
                feedback: 'Mover sin evaluar puede agravar una lesión, sobre todo si hubo caída.'
            },
            {
                text: 'Le doy un medicamento para el mareo.',
                type: 'risk',
                points: 0,
                feedback: 'No corresponde medicar sin indicación profesional.'
            }
        ]
    },

    mission5: {
        intro: {
            title: 'Caso integrador: club comunitario',
            text: 'Durante una actividad en el club, una persona tropieza, cae al suelo y queda mareada. Hay nervios, una silla caída y una botella rota cerca.',
            goal: 'Tomá decisiones seguras siguiendo PAS: observá, protegé, avisá y recién después socorré dentro de tus posibilidades.'
        },
        statusLabels: [
            { key: 'observe', label: 'Escena evaluada' },
            { key: 'protect', label: 'Riesgos atendidos' },
            { key: 'alert', label: 'Ayuda activada' },
            { key: 'help', label: 'Acompañamiento seguro' }
        ],
        decisions: [
            {
                id: 1,
                pas: 'Observar',
                pasKey: 'observe',
                context: 'Llegás al salón del club. Una persona está en el suelo, mareada. Hay gente nerviosa alrededor, una silla caída y una botella rota cerca.',
                question: '¿Qué hacés primero?',
                options: [
                    {
                        text: 'Me acerco rápido y trato de levantarla.',
                        points: 0,
                        type: 'risk',
                        label: 'Decisión riesgosa',
                        feedback: 'Antes de tocar o mover a una persona, es importante observar la escena y verificar riesgos.'
                    },
                    {
                        text: 'Observo la escena para identificar riesgos antes de intervenir.',
                        points: 2,
                        type: 'safe',
                        label: 'Decisión segura',
                        feedback: 'El primer paso es proteger: observar si hay riesgos para vos, para la víctima o para otras personas.'
                    },
                    {
                        text: 'Le doy agua para que se recupere.',
                        points: 0,
                        type: 'risk',
                        label: 'Decisión riesgosa',
                        feedback: 'Dar agua, comida o medicación puede ser riesgoso si no sabemos qué le ocurre.'
                    }
                ]
            },
            {
                id: 2,
                pas: 'Proteger',
                pasKey: 'protect',
                context: 'Al observar mejor, ves la botella rota cerca de la persona y la silla caída que dificulta el paso. Alguien intenta acercarse sin mirar.',
                question: '¿Qué riesgo deberías atender primero?',
                options: [
                    {
                        text: 'Retiro o señalo los objetos peligrosos sin ponerme en riesgo.',
                        points: 2,
                        type: 'safe',
                        label: 'Decisión segura',
                        feedback: 'Proteger implica reducir riesgos de la escena sin exponerse innecesariamente.'
                    },
                    {
                        text: 'Ignoro los objetos y me concentro solo en la persona.',
                        points: 0,
                        type: 'risk',
                        label: 'Decisión riesgosa',
                        feedback: 'Si la escena sigue siendo riesgosa, otras personas también podrían lastimarse.'
                    },
                    {
                        text: 'Pido a todos que se alejen empujándolos.',
                        points: 1,
                        type: 'partial',
                        label: 'Decisión parcial',
                        feedback: 'Ordenar el espacio puede ayudar, pero debe hacerse con calma, sin generar más tensión ni empujar a nadie.'
                    }
                ]
            },
            {
                id: 3,
                pas: 'Avisar',
                pasKey: 'alert',
                context: 'La escena está más ordenada. La persona sigue mareada. Hay personas alrededor que pueden colaborar.',
                question: '¿Cómo activás la ayuda?',
                options: [
                    {
                        text: 'Pido a una persona específica que llame al sistema de emergencias y dé ubicación clara.',
                        points: 2,
                        type: 'safe',
                        label: 'Decisión segura',
                        feedback: 'Es mejor indicar a alguien concretamente qué hacer y pedir que informe lugar, situación y estado general.'
                    },
                    {
                        text: 'Grito "que alguien llame" y sigo actuando.',
                        points: 1,
                        type: 'partial',
                        label: 'Decisión parcial',
                        feedback: 'Puede servir, pero es menos efectivo. En una emergencia conviene asignar la tarea a una persona concreta.'
                    },
                    {
                        text: 'Espero unos minutos para ver si mejora antes de pedir ayuda.',
                        points: 0,
                        type: 'risk',
                        label: 'Decisión riesgosa',
                        feedback: 'Si hay dudas o la persona no se recupera claramente, conviene activar ayuda a tiempo.'
                    }
                ]
            },
            {
                id: 4,
                pas: 'Socorrer',
                pasKey: 'help',
                context: 'La escena ya está más ordenada y otra persona está llamando para pedir ayuda. La víctima sigue mareada pero responde cuando le hablás.',
                question: '¿Qué acción es más segura?',
                options: [
                    {
                        text: 'Acompaño a la persona, le hablo con calma y evito moverla innecesariamente.',
                        points: 2,
                        type: 'safe',
                        label: 'Decisión segura',
                        feedback: 'Socorrer no significa hacer maniobras complejas, sino acompañar, observar y evitar acciones que puedan empeorar la situación.'
                    },
                    {
                        text: 'La levanto entre varias personas para sentarla rápido.',
                        points: 0,
                        type: 'risk',
                        label: 'Decisión riesgosa',
                        feedback: 'Mover a una persona sin evaluar puede agravar una lesión, especialmente si hubo caída o golpe.'
                    },
                    {
                        text: 'Le doy un medicamento para el mareo.',
                        points: 0,
                        type: 'risk',
                        label: 'Decisión riesgosa',
                        feedback: 'En primeros auxilios básicos se debe evitar dar medicación si no hay indicación profesional.'
                    }
                ]
            }
        ],
        keyIdeas: [
            'Primero observá la escena y protegé.',
            'Pedí ayuda a tiempo y comunicá información clara.',
            'No muevas innecesariamente a una persona que pudo lesionarse.',
            'No des agua, comida ni medicación sin indicación profesional.',
            'Ayudar también es acompañar con calma hasta que llegue asistencia.'
        ],
        scoreMessages: {
            high: 'Muy buen recorrido. Tus decisiones priorizaron la seguridad, la activación de ayuda y el acompañamiento responsable.',
            mid: 'Buen avance. Reconociste algunas acciones seguras, aunque todavía conviene revisar el orden: proteger, avisar y socorrer.',
            low: 'Este recorrido muestra la importancia de practicar. Revisá especialmente la regla PAS y las acciones que conviene evitar.'
        },
        reflectionPrompt: '¿Qué decisión te resultó más difícil y por qué?'
    }
};

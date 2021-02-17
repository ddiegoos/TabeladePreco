/ *! Magnific Popup - v1.1.0 - 2016-02-20
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2016 Dmitry Semenov; * /
; (função (fábrica) { 
if (typeof define === 'função' && define.amd) { 
 // AMD. Registre-se como um módulo anônimo.
 define (['jquery'], fábrica); 
 } else if (typeof exportações === 'objeto') { 
 // Nó / CommonJS 
 factory (require ('jquery')); 
 } outro { 
 // Globais do navegador 
 factory (window.jQuery || window.Zepto); 
 } 
 } (função ($) { 

/ * >> núcleo * /
/ **
 * 
 * Arquivo Magnific Popup Core JS
 * 
 * /


/ **
 * Constantes estáticas privadas
 * /
var CLOSE_EVENT = 'Fechar',
	BEFORE_CLOSE_EVENT = 'BeforeClose',
	AFTER_CLOSE_EVENT = 'AfterClose',
	BEFORE_APPEND_EVENT = 'BeforeAppend',
	MARKUP_PARSE_EVENT = 'MarkupParse',
	OPEN_EVENT = 'Abrir',
	CHANGE_EVENT = 'Alterar',
	NS = 'mfp',
	EVENT_NS = '.' + NS,
	READY_CLASS = 'pronto para mfp',
	REMOVING_CLASS = 'remoção de mfp',
	PREVENT_CLOSE_CLASS = 'mfp-impedir-fechar';


/ **
 * Vars privados 
 * /
/ * jshint -W079 * /
var mfp, // Como temos apenas uma instância do objeto MagnificPopup, definimos localmente para não usar 'this'
	MagnificPopup = function () {},
	_isJQ = !! (window.jQuery),
	_prevStatus,
	_window = $ (janela),
	_documento,
	_prevContentType,
	_wrapClasses,
	_currPopupType;


/ **
 * Funções privadas
 * /
var _mfpOn = função (nome, f) {
		mfp.ev.on (NS + nome + EVENT_NS, f);
	}
	_getEl = função (className, appendTo, html, raw) {
		var el = document.createElement ('div');
		el.className = 'mfp -' + className;
		if (html) {
			el.innerHTML = html;
		}
		if (! raw) {
			el = $ (el);
			if (appendTo) {
				el.appendTo (appendTo);
			}
		} se if (appendTo) {
			appendTo.appendChild (el);
		}
		return el;
	}
	_mfpTrigger = função (e, dados) {
		mfp.ev.triggerHandler (NS + e, dados);

		if (mfp.st.callbacks) {
			// converte "mfpEventName" em retorno de chamada "eventName" e o aciona se estiver presente
			e = e.charAt (0) .toLowerCase () + e.slice (1);
			if (mfp.st.callbacks [e]) {
				mfp.st.callbacks [e] .apply (mfp, $ .isArray (data)? data: [data]);
			}
		}
	}
	_getCloseBtn = função (tipo) {
		if (digite! == _currPopupType ||! mfp.currTemplate.closeBtn) {
			mfp.currTemplate.closeBtn = $ (mfp.st.closeMarkup.replace ('% title%', mfp.st.tClose));
			_currPopupType = type;
		}
		retornar mfp.currTemplate.closeBtn;
	}
	// Inicializa o Magnific Popup apenas quando chamado pelo menos uma vez
	_checkInstance = function () {
		if (! $. magnificPopup.instance) {
			/ * jshint -W020 * /
			mfp = novo MagnificPopup ();
			mfp.init ();
			$ .magnificPopup.instance = mfp;
		}
	}
	// Detecção de transição CSS, http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
	supportTransitions = function () {
		var s = document.createElement ('p'). style, // 's' para style. melhor criar um elemento se o corpo ainda existir
			v = ['ms', 'O', 'Moz', 'Webkit']; // 'v' para fornecedor

		if (s ['transição']! == indefinido) {
			return true; 
		}
			
		while (v.length) {
			if (v.pop () + 'Transição' em s) {
				return true;
			}
		}
				
		retorna falso;
	};



/ **
 * Funções públicas
 * /
MagnificPopup.prototype = {

	construtor: MagnificPopup,

	/ **
	 * Inicializa o plugin Magnific Popup. 
	 * Esta função é acionada apenas uma vez quando $ .fn.magnificPopup ou $ .magnificPopup é executado
	 * /
	init: function () {
		var appVersion = navigator.appVersion;
		mfp.isLowIE = mfp.isIE8 = document.all &&! document.addEventListener;
		mfp.isAndroid = (/android/gi).test(appVersion);
		mfp.isIOS = (/iphone|ipad|ipod/gi).test(appVersion);
		mfp.supportsTransition = suportaTransições ();

		// Desativamos a mesa de luz de posição fixa em dispositivos que não lidam bem com ela.
		// Se você souber uma maneira melhor de detectar isso, me avise.
		mfp.probablyMobile = (mfp.isAndroid || mfp.isIOS || / (Opera Mini) | Kindle | webOS | BlackBerry | (Opera Mobi) | (Windows Phone) | IEMobile / i.test (navigator.userAgent));
		_document = $ (documento);

		mfp.popupsCache = {};
	}

	/ **
	 * Abre pop-up
	 * @param data [descrição]
	 * /
	open: function (data) {

		var i;

		if (data.isObj === false) { 
			// converte a coleção jQuery em array para evitar conflitos posteriormente
			mfp.items = data.items.toArray ();

			mfp.index = 0;
			var items = data.items,
				item;
			para (i = 0; i <items.length; i ++) {
				item = itens [i];
				if (item.parsed) {
					item = item.el [0];
				}
				if (item === data.el [0]) {
					mfp.index = i;
					pausa;
				}
			}
		} outro {
			mfp.items = $ .isArray (data.items)? data.items: [data.items];
			mfp.index = data.index || 0;
		}

		// se o pop-up já estiver aberto - atualizamos o conteúdo
		if (mfp.isOpen) {
			mfp.updateItemHTML ();
			Retorna;
		}
		
		mfp.types = []; 
		_wrapClasses = '';
		if (data.mainEl && data.mainEl.length) {
			mfp.ev = data.mainEl.eq (0);
		} outro {
			mfp.ev = _documento;
		}

		if (data.key) {
			if (! mfp.popupsCache [data.key]) {
				mfp.popupsCache [data.key] = {};
			}
			mfp.currTemplate = mfp.popupsCache [data.key];
		} outro {
			mfp.currTemplate = {};
		}



		mfp.st = $ .extend (true, {}, $ .magnificPopup.defaults, dados); 
		mfp.fixedContentPos = mfp.st.fixedContentPos === 'automático'? ! mfp.probablyMobile: mfp.st.fixedContentPos;

		if (mfp.st.modal) {
			mfp.st.closeOnContentClick = false;
			mfp.st.closeOnBgClick = false;
			mfp.st.showCloseBtn = false;
			mfp.st.enableEscapeKey = false;
		}
		

		// Marcação de construção
		// contêineres principais são criados apenas uma vez
		if (! mfp.bgOverlay) {

			// Sobreposição escura
			mfp.bgOverlay = _getEl ('bg'). on ('clique' + EVENT_NS, function () {
				mfp.close ();
			});

			mfp.wrap = _getEl ('wrap'). attr ('tabindex', -1) .on ('clique' + EVENT_NS, função (e) {
				if (mfp._checkIfClose (e.target)) {
					mfp.close ();
				}
			});

			mfp.container = _getEl ('container', mfp.wrap);
		}

		mfp.contentContainer = _getEl ('conteúdo');
		if (mfp.st.preloader) {
			mfp.preloader = _getEl ('preloader', mfp.container, mfp.st.tLoading);
		}


		// Inicializando módulos
		var modules = $ .magnificPopup.modules;
		para (i = 0; i <modules.length; i ++) {
			var n = módulos [i];
			n = n.charAt (0) .toUpperCase () + n.slice (1);
			mfp ['init' + n]. chamada (mfp);
		}
		_mfpTrigger ('BeforeOpen');


		if (mfp.st.showCloseBtn) {
			// Botão Fechar
			if (! mfp.st.closeBtnInside) {
				mfp.wrap.append (_getCloseBtn ());
			} outro {
				_mfpOn (MARKUP_PARSE_EVENT, função (e, modelo, valores, item) {
					values.close_replaceWith = _getCloseBtn (item.type);
				});
				_wrapClasses + = 'mfp-close-btn-in';
			}
		}

		if (mfp.st.alignTop) {
			_wrapClasses + = 'mfp-align-top';
		}

	

		if (mfp.fixedContentPos) {
			mfp.wrap.css ({
				estouro: mfp.st.overflowY,
				overflowX: 'oculto',
				overflowY: mfp.st.overflowY
			});
		} outro {
			mfp.wrap.css ({ 
				top: _window.scrollTop (),
				posição: 'absoluto'
			});
		}
		if (mfp.st.fixedBgPos === false || (mfp.st.fixedBgPos === 'automático' &&! mfp.fixedContentPos)) {
			mfp.bgOverlay.css ({
				height: _document.height (),
				posição: 'absoluto'
			});
		}

		

		if (mfp.st.enableEscapeKey) {
			// Fechar na tecla ESC
			_document.on ('keyup' + EVENT_NS, function (e) {
				if (e.keyCode === 27) {
					mfp.close ();
				}
			});
		}

		_window.on ('redimensionar' + EVENT_NS, function () {
			mfp.updateSize ();
		});


		if (! mfp.st.closeOnContentClick) {
			_wrapClasses + = 'mfp-auto-cursor';
		}
		
		if (_wrapClasses)
			mfp.wrap.addClass (_wrapClasses);


		// isso aciona o recálculo do layout, portanto, fazemos uma vez para não acionar duas vezes
		var windowHeight = mfp.wH = _window.height ();

		
		var windowStyles = {};

		if (mfp.fixedContentPos) {
            if (mfp._hasScrollBar (windowHeight)) {
                var s = mfp._getScrollbarSize ();
                se (s) {
                    windowStyles.marginRight = s;
                }
            }
        }

		if (mfp.fixedContentPos) {
			if (! mfp.isIE7) {
				windowStyles.overflow = 'oculto';
			} outro {
				// bug de rolagem dupla ie7
				$ ('body, html'). css ('estouro', 'oculto');
			}
		}

		
		
		var classesToadd = mfp.st.mainClass;
		if (mfp.isIE7) {
			classesToadd + = 'mfp-ie7';
		}
		if (classesToadd) {
			mfp._addClassToMFP (classesToadd);
		}

		// adicionar conteúdo
		mfp.updateItemHTML ();

		_mfpTrigger ('BuildControls');

		// remove a barra de rolagem, adiciona margem etc.
		$ ('html'). css (windowStyles);
		
		// adiciona tudo ao DOM
		mfp.bgOverlay.add (mfp.wrap) .prependTo (mfp.st.prependTo || $ (document.body));

		// Salva o último elemento focado
		mfp._lastFocusedEl = document.activeElement;
		
		// Aguarde o próximo ciclo para permitir a transição CSS
		setTimeout (function () {
			
			if (mfp.content) {
				mfp._addClassToMFP (READY_CLASS);
				mfp._setFocus ();
			} outro {
				// se o conteúdo não estiver definido (não carregado, etc.), adicionaremos classe apenas para BG
				mfp.bgOverlay.addClass (READY_CLASS);
			}
			
			// Intercepte o foco no pop-up
			_document.on ('focusin' + EVENT_NS, mfp._onFocusIn);

		16);

		mfp.isOpen = true;
		mfp.updateSize (windowHeight);
		_mfpTrigger (OPEN_EVENT);

		retornar dados;
	}

	/ **
	 * Fecha o pop-up
	 * /
	fechar: function () {
		if (! mfp.isOpen) retorna;
		_mfpTrigger (BEFORE_CLOSE_EVENT);

		mfp.isOpen = false;
		// para animação CSS3
		if (mfp.st.removalDelay &&! mfp.isLowIE && mfp.supportsTransition) {
			mfp._addClassToMFP (REMOVING_CLASS);
			setTimeout (function () {
				mfp._close ();
			}, mfp.st.removalDelay);
		} outro {
			mfp._close ();
		}
	}

	/ **
	 * Auxiliar para a função close ()
	 * /
	_close: function () {
		_mfpTrigger (CLOSE_EVENT);

		var classesToRemove = REMOVING_CLASS + '' + READY_CLASS + '';

		mfp.bgOverlay.detach ();
		mfp.wrap.detach ();
		mfp.container.empty ();

		if (mfp.st.mainClass) {
			classesToRemove + = mfp.st.mainClass + '';
		}

		mfp._removeClassFromMFP (classesToRemove);

		if (mfp.fixedContentPos) {
			var windowStyles = {marginRight: ''};
			if (mfp.isIE7) {
				$ ('corpo, html'). css ('estouro', '');
			} outro {
				windowStyles.overflow = '';
			}
			$ ('html'). css (windowStyles);
		}
		
		_document.off ('keyup' + EVENT_NS + 'focusin' + EVENT_NS);
		mfp.ev.off (EVENT_NS);

		// limpa elementos DOM que não foram removidos
		mfp.wrap.attr ('classe', 'mfp-wrap'). removeAttr ('estilo');
		mfp.bgOverlay.attr ('classe', 'mfp-bg');
		mfp.container.attr ('classe', 'mfp-container');

		// remove o botão fechar do elemento de destino
		if (mfp.st.showCloseBtn &&
		(! mfp.st.closeBtnInside || mfp.currTemplate [mfp.currItem.type] === verdadeiro)) {
			if (mfp.currTemplate.closeBtn)
				mfp.currTemplate.closeBtn.detach ();
		}


		if (mfp.st.autoFocusLast && mfp._lastFocusedEl) {
			$ (mfp._lastFocusedEl) .focus (); // coloca o foco da guia de volta
		}
		mfp.currItem = null;	
		mfp.content = nulo;
		mfp.currTemplate = nulo;
		mfp.prevHeight = 0;

		_mfpTrigger (AFTER_CLOSE_EVENT);
	}
	
	updateSize: function (winHeight) {

		if (mfp.isIOS) {
			// corrige as barras de navegação do iOS https://github.com/dimsemenov/Magnific-Popup/issues/2
			var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
			var height = window.innerHeight * zoomLevel;
			mfp.wrap.css ('altura', altura);
			mfp.wH = altura;
		} outro {
			mfp.wH = winHeight || _window.height ();
		}
		// Correções # 84: pop-up posicionado incorretamente com a posição: relativa no corpo
		if (! mfp.fixedContentPos) {
			mfp.wrap.css ('altura', mfp.wH);
		}

		_mfpTrigger ('Redimensionar');

	}

	/ **
	 * Defina o conteúdo do pop-up com base no índice atual
	 * /
	updateItemHTML: function () {
		var item = mfp.items [mfp.index];

		// Desconecte e execute modificações
		mfp.contentContainer.detach ();

		if (mfp.content)
			mfp.content.detach ();

		if (! item.parsed) {
			item = mfp.parseEl (mfp.index);
		}

		var type = item.type;

		_mfpTrigger ('BeforeChange', [mfp.currItem? mfp.currItem.type: '', tipo]);
		// O evento BeforeChange funciona assim:
		// _mfpOn ('BeforeChange', function (e, prevType, newType) {});

		mfp.currItem = item;

		if (! mfp.currTemplate [type]) {
			marcação var = mfp.st [tipo]? mfp.st [tipo] .markup: false;

			// permite modificar a marcação
			_mfpTrigger ('FirstMarkupParse', marcação);

			if (marcação) {
				mfp.currTemplate [type] = $ (marcação);
			} outro {
				// se não houver marcação encontrada, apenas definiremos que o modelo será analisado
				mfp.currTemplate [type] = true;
			}
		}

		if (_prevContentType && _prevContentType! == item.type) {
			mfp.container.removeClass ('mfp -' + _ prevContentType + '- holder');
		}

		var newContent = mfp ['get' + type.charAt (0) .toUpperCase () + type.slice (1)] (item, mfp.currTemplate [type]);
		mfp.appendContent (newContent, tipo);

		item.preloaded = true;

		_mfpTrigger (CHANGE_EVENT, item);
		_prevContentType = item.type;

		// Anexar contêiner novamente após a alteração do conteúdo
		mfp.container.prepend (mfp.contentContainer);

		_mfpTrigger ('AfterChange');
	}


	/ **
	 * Defina o conteúdo HTML do pop-up
	 * /
	appendContent: function (newContent, tipo) {
		mfp.content = newContent;

		if (newContent) {
			if (mfp.st.showCloseBtn && mfp.st.closeBtnInside &&
				mfp.currTemplate [type] === true) {
				// se não houver marcação, basta adicionar o elemento do botão fechar dentro
				if (! mfp.content.find ('. mfp-close'). length) {
					mfp.content.append (_getCloseBtn ());
				}
			} outro {
				mfp.content = newContent;
			}
		} outro {
			mfp.content = '';
		}

		_mfpTrigger (BEFORE_APPEND_EVENT);
		mfp.container.addClass ('mfp -' + type + '- holder');

		mfp.contentContainer.append (mfp.content);
	}


	/ **
	 * Cria o objeto de dados Magnific Popup com base nos dados fornecidos
	 * @param {int} index Índice do item a ser analisado
	 * /
	parseEl: função (índice) {
		var item = mfp.items [index],
			tipo;

		if (item.tagName) {
			item = {el: $ (item)};
		} outro {
			tipo = item.type;
			item = {dados: item, src: item.src};
		}

		if (item.el) {
			var tipos = mfp.types;

			// verifique a classe 'mfp-TYPE'
			for (var i = 0; i <types.length; i ++) {
				if (item.el.hasClass ('mfp -' + digita [i])) {
					tipo = tipos [i];
					pausa;
				}
			}

			item.src = item.el.attr ('data-mfp-src');
			if (! item.src) {
				item.src = item.el.attr ('href');
			}
		}

		item.type = tipo || mfp.st.type || 'na linha';
		item.index = índice;
		item.parsed = true;
		mfp.items [index] = item;
		_mfpTrigger ('ElementParse', item);

		retornar mfp.items [index];
	}


	/ **
	 * Inicializa um único pop-up ou um grupo de pop-ups
	 * /
	addGroup: function (el, opções) {
		var eHandler = função (e) {
			e.mfpEl = isso;
			mfp._openClick (e, el, opções);
		};

		if (! opções) {
			opções = {};
		}

		var eName = 'click.magnificPopup';
		options.mainEl = el;

		if (options.items) {
			options.isObj = true;
			el.off (eName) .on (eName, eHandler);
		} outro {
			options.isObj = false;
			if (options.delegate) {
				el.off (eName) .on (eName, options.delegate, eHandler);
			} outro {
				options.items = el;
				el.off (eName) .on (eName, eHandler);
			}
		}
	}
	_openClick: function (e, el, opções) {
		var midClick = options.midClick! == indefinido? options.midClick: $ .magnificPopup.defaults.midClick;


		if (! midClick && (e.which === 2 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey)) {
			Retorna;
		}

		var disableOn = options.disableOn! == indefinido? options.disableOn: $ .magnificPopup.defaults.disableOn;

		if (disableOn) {
			if ($. isFunction (disableOn)) {
				if (! disableOn.call (mfp)) {
					return true;
				}
			} else {// else é número
				if (_window.width () <disableOn) {
					return true;
				}
			}
		}

		if (e.type) {
			e.preventDefault ();

			// Isso impedirá o pop-up de fechar se o elemento estiver dentro e o pop-up já estiver aberto
			if (mfp.isOpen) {
				e.stopPropagation ();
			}
		}

		options.el = $ (e.mfpEl);
		if (options.delegate) {
			options.items = el.find (options.delegate);
		}
		mfp.open (opções);
	}


	/ **
	 * Atualiza o texto no preloader
	 * /
	updateStatus: function (status, texto) {

		if (mfp.preloader) {
			if (_prevStatus! == status) {
				mfp.container.removeClass ('mfp-s -' + _ prevStatus);
			}

			if (! text && status === 'loading') {
				text = mfp.st.tLoading;
			}

			var data = {
				status: status,
				texto: texto
			};
			// permite modificar o status
			_mfpTrigger ('UpdateStatus', dados);

			status = data.status;
			text = data.text;

			mfp.preloader.html (texto);

			mfp.preloader.find ('a'). on ('clique', função (e) {
				e.stopImmediatePropagation ();
			});

			mfp.container.addClass ('mfp-s -' + status);
			_prevStatus = status;
		}
	}


	/ *
		Ajudantes "particulares" que não são particulares
	 * /
	// Marque para fechar o pop-up ou não
	// "target" é um elemento que foi clicado
	_checkIfClose: function (target) {

		if ($ (target) .hasClass (PREVENT_CLOSE_CLASS)) {
			Retorna;
		}

		var closeOnContent = mfp.st.closeOnContentClick;
		var closeOnBg = mfp.st.closeOnBgClick;

		if (closeOnContent && closeOnBg) {
			return true;
		} outro {

			// Fechamos o pop-up se o clique estiver no botão Fechar ou no pré-carregador. Ou se não houver conteúdo.
			if (! mfp.content || $ (target) .hasClass ('mfp-close') || (mfp.preloader && target === mfp.preloader [0])) {
				return true;
			}

			// se o clique estiver fora do conteúdo
			if ((target! == mfp.content [0] &&! $. contains (mfp.content [0], target))) {
				if (closeOnBg) {
					// última verificação, se o elemento clicado estiver no DOM (caso ele seja removido ao clicar)
					if ($ .contains (documento, destino)) {
						return true;
					}
				}
			} senão se (closeOnContent) {
				return true;
			}

		}
		retorna falso;
	}
	_addClassToMFP: function (cName) {
		mfp.bgOverlay.addClass (cName);
		mfp.wrap.addClass (cName);
	}
	_removeClassFromMFP: function (cName) {
		this.bgOverlay.removeClass (cName);
		mfp.wrap.removeClass (cName);
	}
	_hasScrollBar: function (winHeight) {
		return ((mfp.isIE7? _document.height (): document.body.scrollHeight)> ((winHeight || _window.height ()));
	}
	_setFocus: function () {
		(mfp.st.focus? mfp.content.find (mfp.st.focus). eq (0): mfp.wrap) .focus ();
	}
	_onFocusIn: function (e) {
		if (e.target! == mfp.wrap [0] e&! $. contains (mfp.wrap [0], e.target)) {
			mfp._setFocus ();
			retorna falso;
		}
	}
	_parseMarkup: function (modelo, valores, item) {
		var arr;
		if (item.data) {
			valores = $ .extend (item.data, values);
		}
		_mfpTrigger (MARKUP_PARSE_EVENT, [modelo, valores, item]);

		$ .each (valores, função (chave, valor) {
			if (valor === indefinido || valor === falso) {
				return true;
			}
			arr = key.split ('_');
			if (comprimento arr.> 1) {
				var el = template.find (EVENT_NS + '-' + arr [0]);

				if (el.length> 0) {
					var attr = arr [1];
					if (attr === 'replaceWith') {
						if (el [0]! == valor [0]) {
							el.replaceWith (value);
						}
					} else if (attr === 'img') {
						if (el.is ('img')) {
							el.attr ('src', valor);
						} outro {
							el.replaceWith ($ ('<img>') .attr ('src', valor) .attr ('classe', el.attr ('classe')));
						}
					} outro {
						el.attr (arr [1], valor);
					}
				}

			} outro {
				template.find (EVENT_NS + '-' + tecla) .html (valor);
			}
		});
	}

	_getScrollbarSize: function () {
		// thx David
		if (mfp.scrollbarSize === indefinido) {
			var scrollDiv = document.createElement ("div");
			scrollDiv.style.cssText = 'largura: 99px; altura: 99px; estouro: rolagem; posição: absoluta; topo: -9999px; ';
			document.body.appendChild (scrollDiv);
			mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
			document.body.removeChild (scrollDiv);
		}
		retornar mfp.scrollbarSize;
	}

}; / * Fim do protótipo do núcleo MagnificPopup * /




/ **
 * Funções estáticas públicas
 * /
$ .magnificPopup = {
	instância: null,
	proto: MagnificPopup.prototype,
	módulos: [],

	open: function (opções, índice) {
		_checkInstance ();

		if (! opções) {
			opções = {};
		} outro {
			options = $ .extend (true, {}, opções);
		}

		options.isObj = true;
		options.index = index || 0;
		retorne this.instance.open (opções);
	}

	fechar: function () {
		return $ .magnificPopup.instance && $ .magnificPopup.instance.close ();
	}

	registerModule: function (nome, módulo) {
		if (module.options) {
			$ .magnificPopup.defaults [nome] = module.options;
		}
		$ .extend (this.proto, module.proto);
		this.modules.push (nome);
	}

	padrões: {

		// As informações sobre as opções estão nos documentos:
		// http://dimsemenov.com/plugins/magnific-popup/documentation.html#options

		disableOn: 0,

		chave: nulo,

		midClick: false,

		mainClass: '',

		preloader: true,

		focus: '', // Seletor CSS da entrada a ser focada após a abertura do pop-up

		closeOnContentClick: false,

		closeOnBgClick: true,

		closeBtnInside: true,

		showCloseBtn: true,

		enableEscapeKey: true,

		modal: false,

		alignTop: false,

		removalDelay: 0,

		prependTo: null,

		fixedContentPos: 'auto',

		fixedBgPos: 'auto',

		overflowY: 'auto',

		closeMarkup: '<button title = "% title%" type = "button" class = "mfp-close"> & # 215; </button>',

		tFechar: 'Fechar (Esc)',

		tCarregando: 'Carregando ...',

		autoFocusLast: true

	}
};



$ .fn.magnificPopup = função (opções) {
	_checkInstance ();

	var jqEl = $ (isto);

	// Chamamos algum método de API do primeiro param como uma string
	if (typeof options === "string") {

		if (opções === 'aberto') {
			itens var,
				itemOpts = _isJQ? jqEl.data ('magnificPopup'): jqEl [0] .magnificPopup,
				índice = parseInt (argumentos [1], 10) || 0;

			if (itemOpts.items) {
				items = itemOpts.items [index];
			} outro {
				itens = jqEl;
				if (itemOpts.delegate) {
					items = items.find (itemOpts.delegate);
				}
				items = items.eq (índice);
			}
			mfp._openClick ({mfpEl: items}, jqEl, itemOpts);
		} outro {
			if (mfp.isOpen)
				mfp [opções] .apply (mfp, Array.prototype.slice.call (argumentos, 1));
		}

	} outro {
		// obj de opções de clone
		options = $ .extend (true, {}, opções);

		/ *
		 * Como o Zepto não suporta o método .data () para objetos
		 * e funciona apenas em navegadores normais
		 * nós atribuímos o objeto "options" diretamente ao elemento DOM. FTW!
		 * /
		if (_isJQ) {
			jqEl.data ('magnificPopup', opções);
		} outro {
			jqEl [0] .magnificPopup = opções;
		}

		mfp.addGroup (jqEl, opções);

	}
	retornar jqEl;
};

/ * >> núcleo * /

/ * >> inline * /

var INLINE_NS = 'inline',
	_hiddenClass,
	_inlinePlaceholder,
	_lastInlineElement,
	_putInlineElementsBack = function () {
		if (_lastInlineElement) {
			_inlinePlaceholder.after (_lastInlineElement.addClass (_hiddenClass)) .detach ();
			_lastInlineElement = null;
		}
	};

$ .magnificPopup.registerModule (INLINE_NS, {
	opções: {
		hiddenClass: 'hide', // será anexado com o prefixo `mfp-`
		marcação: '',
		tNotFound: 'Conteúdo não encontrado'
	}
	proto: {

		initInline: function () {
			mfp.types.push (INLINE_NS);

			_mfpOn (CLOSE_EVENT + '.' + INLINE_NS, function () {
				_putInlineElementsBack ();
			});
		}

		getInline: function (item, modelo) {

			_putInlineElementsBack ();

			if (item.src) {
				var inlineSt = mfp.st.inline,
					el = $ (item.src);

				if (el.length) {

					// Se o elemento de destino tiver pai - nós o substituímos pelo espaço reservado e o colocamos novamente depois que o pop-up é fechado
					var pai = el [0] .parentNode;
					if (parent && parent.tagName) {
						if (! _ inlinePlaceholder) {
							_hiddenClass = inlineSt.hiddenClass;
							_inlinePlaceholder = _getEl (_hiddenClass);
							_hiddenClass = 'mfp -' + _ hiddenClass;
						}
						// substitui o elemento inline de destino pelo espaço reservado
						_lastInlineElement = el.after (_inlinePlaceholder) .detach (). removeClass (_hiddenClass);
					}

					mfp.updateStatus ('pronto');
				} outro {
					mfp.updateStatus ('erro', inlineSt.tNotFound);
					el = $ ('<div>');
				}

				item.inlineElement = el;
				return el;
			}

			mfp.updateStatus ('pronto');
			mfp._parseMarkup (modelo, {}, item);
			modelo de retorno;
		}
	}
});

/ * >> inline * /

/ * >> ajax * /
var AJAX_NS = 'ajax',
	_ajaxCur,
	_removeAjaxCursor = function () {
		if (_ajaxCur) {
			$ (document.body) .removeClass (_ajaxCur);
		}
	}
	_destroyAjaxRequest = function () {
		_removeAjaxCursor ();
		if (mfp.req) {
			mfp.req.abort ();
		}
	};

$ .magnificPopup.registerModule (AJAX_NS, {

	opções: {
		configurações: null,
		cursor: 'mfp-ajax-cur',
		tError: '<a href="%url%"> O conteúdo </a> não pôde ser carregado.'
	}

	proto: {
		initAjax: function () {
			mfp.types.push (AJAX_NS);
			_ajaxCur = mfp.st.ajax.cursor;

			_mfpOn (CLOSE_EVENT + '.' + AJAX_NS, _destroyAjaxRequest);
			_mfpOn ('BeforeChange.' + AJAX_NS, _destroyAjaxRequest);
		}
		getAjax: function (item) {

			if (_ajaxCur) {
				$ (document.body) .addClass (_ajaxCur);
			}

			mfp.updateStatus ('loading');

			var opts = $ .extend ({
				url: item.src,
				success: function (data, textStatus, jqXHR) {
					var temp = {
						dados: dados,
						xhr: jqXHR
					};

					_mfpTrigger ('ParseAjax', temp);

					mfp.appendContent ($ (temp.data), AJAX_NS);

					item.finished = true;

					_removeAjaxCursor ();

					mfp._setFocus ();

					setTimeout (function () {
						mfp.wrap.addClass (READY_CLASS);
					16);

					mfp.updateStatus ('pronto');

					_mfpTrigger ('AjaxContentAdded');
				}
				error: function () {
					_removeAjaxCursor ();
					item.finished = item.loadError = true;
					mfp.updateStatus ('erro', mfp.st.ajax.tError.replace ('% url%', item.src));
				}
			}, mfp.st.ajax.settings);

			mfp.req = $ .ajax (opta);

			Retorna '';
		}
	}
});

/ * >> ajax * /

/ * >> imagem * /
var _imgInterval,
	_getTitle = função (item) {
		if (item.data && item.data.title! == indefinido)
			retornar item.data.title;

		var src = mfp.st.image.titleSrc;

		if (src) {
			if ($. isFunction (src)) {
				retornar src.call (mfp, item);
			} caso contrário, se (item.el) {
				retornar item.el.attr (src) || '';
			}
		}
		Retorna '';
	};

$ .magnificPopup.registerModule ('imagem', {

	opções: {
		marcação: '<div class = "mfp-figure">'
					'<div class = "mfp-close"> </div>' +
					'<figure>'
						'<div class = "mfp-img"> </div>' +
						'<configuração>'
							'<div class = "mfp-bottom-bar">' +
								'<div class = "mfp-title"> </div>' +
								'<div class = "mfp-counter"> </div>' +
							'</div>'
						'</figcaption>'
					'</figure>'
				'</div>',
		cursor: 'mfp-zoom-out-cur',
		titleSrc: 'title',
		verticalFit: true,
		tError: '<a href="%url%"> A imagem </a> não pôde ser carregada.'
	}

	proto: {
		initImage: function () {
			var imgSt = mfp.st.image,
				ns = '.imagem';

			mfp.types.push ('imagem');

			_mfpOn (OPEN_EVENT + ns, function () {
				if (mfp.currItem.type === 'imagem' && imgSt.cursor) {
					$ (document.body) .addClass (imgSt.cursor);
				}
			});

			_mfpOn (CLOSE_EVENT + ns, função () {
				if (imgSt.cursor) {
					$ (document.body) .removeClass (imgSt.cursor);
				}
				_window.off ('redimensionar' + EVENT_NS);
			});

			_mfpOn ('Redimensionar' + ns, mfp.resizeImage);
			if (mfp.isLowIE) {
				_mfpOn ('AfterChange', mfp.resizeImage);
			}
		}
		resizeImage: function () {
			var item = mfp.currItem;
			if (! item ||! item.img) retorna;

			if (mfp.st.image.verticalFit) {
				var decr = 0;
				// corrige o tamanho da caixa no ie7 / 8
				if (mfp.isLowIE) {
					decr = parseInt (item.img.css ('padding-top'), 10) + parseInt (item.img.css ('padding-bottom'), 10);
				}
				item.img.css ('altura máxima', mfp.wH-decr);
			}
		}
		_onImageHasSize: function (item) {
			if (item.img) {

				item.hasSize = true;

				if (_imgInterval) {
					clearInterval (_imgInterval);
				}

				item.isCheckingImgSize = false;

				_mfpTrigger ('ImageHasSize', item);

				if (item.imgHidden) {
					if (mfp.content)
						mfp.content.removeClass ('mfp-loading');

					item.imgHidden = false;
				}

			}
		}

		/ **
		 * Função que faz um loop até que a imagem tenha tamanho para exibir elementos que dependem dela o mais rápido possível
		 * /
		findImageSize: function (item) {

			contador de var = 0,
				img = item.img [0],
				mfpSetInterval = função (atraso) {

					if (_imgInterval) {
						clearInterval (_imgInterval);
					}
					// intervalo de desaceleração que verifica o tamanho de uma imagem
					_imgInterval = setInterval(function() {
						if(img.naturalWidth > 0) {
							mfp._onImageHasSize(item);
							return;
						}

						if(counter > 200) {
							clearInterval(_imgInterval);
						}

						counter++;
						if(counter === 3) {
							mfpSetInterval(10);
						} else if(counter === 40) {
							mfpSetInterval(50);
						} else if(counter === 100) {
							mfpSetInterval(500);
						}
					}, delay);
				};

			mfpSetInterval(1);
		},

		getImage: function(item, template) {

			var guard = 0,

				// image load complete handler
				onLoadComplete = function() {
					if(item) {
						if (item.img[0].complete) {
							item.img.off('.mfploader');

							if(item === mfp.currItem){
								mfp._onImageHasSize(item);

								mfp.updateStatus('ready');
							}

							item.hasSize = true;
							item.loaded = true;

							_mfpTrigger('ImageLoadComplete');

						}
						else {
							// if image complete check fails 200 times (20 sec), we assume that there was an error.
							guard++;
							if(guard < 200) {
								setTimeout(onLoadComplete,100);
							} else {
								onLoadError();
							}
						}
					}
				},

				// image error handler
				onLoadError = function() {
					if(item) {
						item.img.off('.mfploader');
						if(item === mfp.currItem){
							mfp._onImageHasSize(item);
							mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
						}

						item.hasSize = true;
						item.loaded = true;
						item.loadError = true;
					}
				},
				imgSt = mfp.st.image;


			var el = template.find('.mfp-img');
			if(el.length) {
				var img = document.createElement('img');
				img.className = 'mfp-img';
				if(item.el && item.el.find('img').length) {
					img.alt = item.el.find('img').attr('alt');
				}
				item.img = $(img).on('load.mfploader', onLoadComplete).on('error.mfploader', onLoadError);
				img.src = item.src;

				// without clone() "error" event is not firing when IMG is replaced by new IMG
				// TODO: find a way to avoid such cloning
				if(el.is('img')) {
					item.img = item.img.clone();
				}

				img = item.img[0];
				if(img.naturalWidth > 0) {
					item.hasSize = true;
				} else if(!img.width) {
					item.hasSize = false;
				}
			}

			mfp._parseMarkup(template, {
				title: _getTitle(item),
				img_replaceWith: item.img
			}, item);

			mfp.resizeImage();

			if(item.hasSize) {
				if(_imgInterval) clearInterval(_imgInterval);

				if(item.loadError) {
					template.addClass('mfp-loading');
					mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
				} else {
					template.removeClass('mfp-loading');
					mfp.updateStatus('ready');
				}
				return template;
			}

			mfp.updateStatus('loading');
			item.loading = true;

			if(!item.hasSize) {
				item.imgHidden = true;
				template.addClass('mfp-loading');
				mfp.findImageSize(item);
			}

			return template;
		}
	}
});

/*>>image*/

/*>>zoom*/
var hasMozTransform,
	getHasMozTransform = function() {
		if(hasMozTransform === undefined) {
			hasMozTransform = document.createElement('p').style.MozTransform !== undefined;
		}
		return hasMozTransform;
	};

$.magnificPopup.registerModule('zoom', {

	options: {
		enabled: false,
		easing: 'ease-in-out',
		duration: 300,
		opener: function(element) {
			return element.is('img') ? element : element.find('img');
		}
	},

	proto: {

		initZoom: function() {
			var zoomSt = mfp.st.zoom,
				ns = '.zoom',
				image;

			if(!zoomSt.enabled || !mfp.supportsTransition) {
				return;
			}

			var duration = zoomSt.duration,
				getElToAnimate = function(image) {
					var newImg = image.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image'),
						transition = 'all '+(zoomSt.duration/1000)+'s ' + zoomSt.easing,
						cssObj = {
							position: 'fixed',
							zIndex: 9999,
							left: 0,
							top: 0,
							'-webkit-backface-visibility': 'hidden'
						},
						t = 'transition';

					cssObj['-webkit-'+t] = cssObj['-moz-'+t] = cssObj['-o-'+t] = cssObj[t] = transition;

					newImg.css(cssObj);
					return newImg;
				},
				showMainContent = function() {
					mfp.content.css('visibility', 'visible');
				},
				openTimeout,
				animatedImg;

			_mfpOn('BuildControls'+ns, function() {
				if(mfp._allowZoom()) {

					clearTimeout(openTimeout);
					mfp.content.css('visibility', 'hidden');

					// Basically, all code below does is clones existing image, puts in on top of the current one and animated it

					image = mfp._getItemToZoom();

					if(!image) {
						showMainContent();
						return;
					}

					animatedImg = getElToAnimate(image);

					animatedImg.css( mfp._getOffset() );

					mfp.wrap.append(animatedImg);

					openTimeout = setTimeout(function() {
						animatedImg.css( mfp._getOffset( true ) );
						openTimeout = setTimeout(function() {

							showMainContent();

							setTimeout(function() {
								animatedImg.remove();
								image = animatedImg = null;
								_mfpTrigger('ZoomAnimationEnded');
							}, 16); // avoid blink when switching images

						}, duration); // this timeout equals animation duration

					}, 16); // by adding this timeout we avoid short glitch at the beginning of animation


					// Lots of timeouts...
				}
			});
			_mfpOn(BEFORE_CLOSE_EVENT+ns, function() {
				if(mfp._allowZoom()) {

					clearTimeout(openTimeout);

					mfp.st.removalDelay = duration;

					if(!image) {
						image = mfp._getItemToZoom();
						if(!image) {
							return;
						}
						animatedImg = getElToAnimate(image);
					}

					animatedImg.css( mfp._getOffset(true) );
					mfp.wrap.append(animatedImg);
					mfp.content.css('visibility', 'hidden');

					setTimeout(function() {
						animatedImg.css( mfp._getOffset() );
					}, 16);
				}

			});

			_mfpOn(CLOSE_EVENT+ns, function() {
				if(mfp._allowZoom()) {
					showMainContent();
					if(animatedImg) {
						animatedImg.remove();
					}
					image = null;
				}
			});
		},

		_allowZoom: function() {
			return mfp.currItem.type === 'image';
		},

		_getItemToZoom: function() {
			if(mfp.currItem.hasSize) {
				return mfp.currItem.img;
			} else {
				return false;
			}
		},

		// Get element postion relative to viewport
		_getOffset: function(isLarge) {
			var el;
			if(isLarge) {
				el = mfp.currItem.img;
			} else {
				el = mfp.st.zoom.opener(mfp.currItem.el || mfp.currItem);
			}

			var offset = el.offset();
			var paddingTop = parseInt(el.css('padding-top'),10);
			var paddingBottom = parseInt(el.css('padding-bottom'),10);
			offset.top -= ( $(window).scrollTop() - paddingTop );


			/*

			Animating left + top + width/height looks glitchy in Firefox, but perfect in Chrome. And vice-versa.

			 */
			var obj = {
				width: el.width(),
				// fix Zepto height+padding issue
				height: (_isJQ ? el.innerHeight() : el[0].offsetHeight) - paddingBottom - paddingTop
			};

			// I hate to do this, but there is no another option
			if( getHasMozTransform() ) {
				obj['-moz-transform'] = obj['transform'] = 'translate(' + offset.left + 'px,' + offset.top + 'px)';
			} else {
				obj.left = offset.left;
				obj.top = offset.top;
			}
			return obj;
		}

	}
});



/*>>zoom*/

/*>>iframe*/

var IFRAME_NS = 'iframe',
	_emptyPage = '//about:blank',

	_fixIframeBugs = function(isShowing) {
		if(mfp.currTemplate[IFRAME_NS]) {
			var el = mfp.currTemplate[IFRAME_NS].find('iframe');
			if(el.length) {
				// reset src after the popup is closed to avoid "video keeps playing after popup is closed" bug
				if(!isShowing) {
					el[0].src = _emptyPage;
				}

				// IE8 black screen bug fix
				if(mfp.isIE8) {
					el.css('display', isShowing ? 'block' : 'none');
				}
			}
		}
	};

$.magnificPopup.registerModule(IFRAME_NS, {

	options: {
		markup: '<div class="mfp-iframe-scaler">'+
					'<div class="mfp-close"></div>'+
					'<iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe>'+
				'</div>',

		srcAction: 'iframe_src',

		// we don't care and support only one default type of URL by default
		patterns: {
			youtube: {
				index: 'youtube.com',
				id: 'v=',
				src: '//www.youtube.com/embed/%id%?autoplay=1'
			},
			vimeo: {
				index: 'vimeo.com/',
				id: '/',
				src: '//player.vimeo.com/video/%id%?autoplay=1'
			},
			gmaps: {
				index: '//maps.google.',
				src: '%id%&output=embed'
			}
		}
	},

	proto: {
		initIframe: function() {
			mfp.types.push(IFRAME_NS);

			_mfpOn('BeforeChange', function(e, prevType, newType) {
				if(prevType !== newType) {
					if(prevType === IFRAME_NS) {
						_fixIframeBugs(); // iframe if removed
					} else if(newType === IFRAME_NS) {
						_fixIframeBugs(true); // iframe is showing
					}
				}// else {
					// iframe source is switched, don't do anything
				//}
			});

			_mfpOn(CLOSE_EVENT + '.' + IFRAME_NS, function() {
				_fixIframeBugs();
			});
		},

		getIframe: function(item, template) {
			var embedSrc = item.src;
			var iframeSt = mfp.st.iframe;

			$.each(iframeSt.patterns, function() {
				if(embedSrc.indexOf( this.index ) > -1) {
					if(this.id) {
						if(typeof this.id === 'string') {
							embedSrc = embedSrc.substr(embedSrc.lastIndexOf(this.id)+this.id.length, embedSrc.length);
						} else {
							embedSrc = this.id.call( this, embedSrc );
						}
					}
					embedSrc = this.src.replace('%id%', embedSrc );
					return false; // break;
				}
			});

			var dataObj = {};
			if(iframeSt.srcAction) {
				dataObj[iframeSt.srcAction] = embedSrc;
			}
			mfp._parseMarkup(template, dataObj, item);

			mfp.updateStatus('ready');

			return template;
		}
	}
});



/*>>iframe*/

/*>>gallery*/
/**
 * Get looped index depending on number of slides
 */
var _getLoopedId = function(index) {
		var numSlides = mfp.items.length;
		if(index > numSlides - 1) {
			return index - numSlides;
		} else  if(index < 0) {
			return numSlides + index;
		}
		return index;
	},
	_replaceCurrTotal = function(text, curr, total) {
		return text.replace(/%curr%/gi, curr + 1).replace(/%total%/gi, total);
	};

$.magnificPopup.registerModule('gallery', {

	options: {
		enabled: false,
		arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
		preload: [0,2],
		navigateByImgClick: true,
		arrows: true,

		tPrev: 'Previous (Left arrow key)',
		tNext: 'Next (Right arrow key)',
		tCounter: '%curr% of %total%'
	},

	proto: {
		initGallery: function() {

			var gSt = mfp.st.gallery,
				ns = '.mfp-gallery';

			mfp.direction = true; // true - next, false - prev

			if(!gSt || !gSt.enabled ) return false;

			_wrapClasses += ' mfp-gallery';

			_mfpOn(OPEN_EVENT+ns, function() {

				if(gSt.navigateByImgClick) {
					mfp.wrap.on('click'+ns, '.mfp-img', function() {
						if(mfp.items.length > 1) {
							mfp.next();
							return false;
						}
					});
				}

				_document.on('keydown'+ns, function(e) {
					if (e.keyCode === 37) {
						mfp.prev();
					} else if (e.keyCode === 39) {
						mfp.next();
					}
				});
			});

			_mfpOn('UpdateStatus'+ns, function(e, data) {
				if(data.text) {
					data.text = _replaceCurrTotal(data.text, mfp.currItem.index, mfp.items.length);
				}
			});

			_mfpOn(MARKUP_PARSE_EVENT+ns, function(e, element, values, item) {
				var l = mfp.items.length;
				values.counter = l > 1 ? _replaceCurrTotal(gSt.tCounter, item.index, l) : '';
			});

			_mfpOn('BuildControls' + ns, function() {
				if(mfp.items.length > 1 && gSt.arrows && !mfp.arrowLeft) {
					var markup = gSt.arrowMarkup,
						arrowLeft = mfp.arrowLeft = $( markup.replace(/%title%/gi, gSt.tPrev).replace(/%dir%/gi, 'left') ).addClass(PREVENT_CLOSE_CLASS),
						arrowRight = mfp.arrowRight = $( markup.replace(/%title%/gi, gSt.tNext).replace(/%dir%/gi, 'right') ).addClass(PREVENT_CLOSE_CLASS);

					arrowLeft.click(function() {
						mfp.prev();
					});
					arrowRight.click(function() {
						mfp.next();
					});

					mfp.container.append(arrowLeft.add(arrowRight));
				}
			});

			_mfpOn(CHANGE_EVENT+ns, function() {
				if(mfp._preloadTimeout) clearTimeout(mfp._preloadTimeout);

				mfp._preloadTimeout = setTimeout(function() {
					mfp.preloadNearbyImages();
					mfp._preloadTimeout = null;
				}, 16);
			});


			_mfpOn(CLOSE_EVENT+ns, function() {
				_document.off(ns);
				mfp.wrap.off('click'+ns);
				mfp.arrowRight = mfp.arrowLeft = null;
			});

		},
		next: function() {
			mfp.direction = true;
			mfp.index = _getLoopedId(mfp.index + 1);
			mfp.updateItemHTML();
		},
		prev: function() {
			mfp.direction = false;
			mfp.index = _getLoopedId(mfp.index - 1);
			mfp.updateItemHTML();
		},
		goTo: function(newIndex) {
			mfp.direction = (newIndex >= mfp.index);
			mfp.index = newIndex;
			mfp.updateItemHTML();
		},
		preloadNearbyImages: function() {
			var p = mfp.st.gallery.preload,
				preloadBefore = Math.min(p[0], mfp.items.length),
				preloadAfter = Math.min(p[1], mfp.items.length),
				i;

			for(i = 1; i <= (mfp.direction ? preloadAfter : preloadBefore); i++) {
				mfp._preloadItem(mfp.index+i);
			}
			for(i = 1; i <= (mfp.direction ? preloadBefore : preloadAfter); i++) {
				mfp._preloadItem(mfp.index-i);
			}
		},
		_preloadItem: function(index) {
			index = _getLoopedId(index);

			if(mfp.items[index].preloaded) {
				return;
			}

			var item = mfp.items[index];
			if(!item.parsed) {
				item = mfp.parseEl( index );
			}

			_mfpTrigger('LazyLoad', item);

			if(item.type === 'image') {
				item.img = $('<img class="mfp-img" />').on('load.mfploader', function() {
					item.hasSize = true;
				}).on('error.mfploader', function() {
					item.hasSize = true;
					item.loadError = true;
					_mfpTrigger('LazyLoadError', item);
				}).attr('src', item.src);
			}


			item.preloaded = true;
		}
	}
});

/*>>gallery*/

/*>>retina*/

var RETINA_NS = 'retina';

$.magnificPopup.registerModule(RETINA_NS, {
	options: {
		replaceSrc: function(item) {
			return item.src.replace(/\.\w+$/, function(m) { return '@2x' + m; });
		},
		ratio: 1 // Function or number.  Set to 1 to disable.
	},
	proto: {
		initRetina: function() {
			if(window.devicePixelRatio > 1) {

				var st = mfp.st.retina,
					ratio = st.ratio;

				ratio = !isNaN(ratio) ? ratio : ratio();

				if(ratio > 1) {
					_mfpOn('ImageHasSize' + '.' + RETINA_NS, function(e, item) {
						item.img.css({
							'max-width': item.img[0].naturalWidth / ratio,
							'width': '100%'
						});
					});
					_mfpOn('ElementParse' + '.' + RETINA_NS, function(e, item) {
						item.src = st.replaceSrc(item, ratio);
					});
				}
			}

		}
	}
});

/*>>retina*/
 _checkInstance(); }));
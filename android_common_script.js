alert("abx 123");
var coccoc_Utils = {
    MEDIA_TYPES: {
        audio: {
            title: "Audio",
            rgxp: /audio/i,
            extensions: ["mp3", "flac", "m4a", "wma", "ogg", "wav", "aif", "mid", "opus"],
            extensions_weight: ["mp3", "flac", "m4a", "wma", "ogg", "wav", "aif", "mid", "opus"],
            ctype2extension: {
                midi: "mid",
                mp4: "m4a",
                m4a: "m4a",
                mpeg: "mp3",
                mpeg3: "mp3",
                wav: "wav",
                aiff: "aif",
                opus: "opus"
            }
        },
        video: {
            title: "Video",
            rgxp: /video/i,
            extensions: ["mp4", "mpeg4", "mpg", "mpeg", "m4v", "avi", "divx", "mov", "wmv", "movie", "asf", "webm", "flv", "3gp"],
            extensions_weight: ["mp4", "mpeg4", "mpg", "mpeg", "m4v", "avi", "divx", "mov", "wmv", "movie", "asf", "webm", "flv", "3gp"],
            ctype2extension: {
                mpeg: "mp4",
                mp4: "mp4",
                m4v: "mp4",
                "3gpp": "3gp",
                flv: "flv",
                quicktime: "mov",
                msvideo: "avi",
                "ms-wmv": "wmv",
                "ms-asf": "asf"
            }
        },
        subtitles: {
            title: "Subtitles",
            rgxp: /subtitles/i,
            extensions: ["yt_srt"],
            extensions_weight: ["yt_srt"]
        }
    }
};
coccoc_Utils.MEDIA_EXTENSION_TYPE_MAP = (()=>{
    const A = new Map;
    return Object.keys(coccoc_Utils.MEDIA_TYPES).forEach(t=>{
        let e = coccoc_Utils.MEDIA_TYPES[t].extensions;
        for (let o = 0; o < e.length; o++)
            A.set(e[o], t)
    }
    ),
    A
}
)(),
coccoc_Utils.isHls = function(A) {
    return -1 !== A.indexOf(".m3u8") || -1 !== A.indexOf(".m3u")
}
,
coccoc_Utils.UrlUtils = (()=>{
    let A = document.createElement("a")
      , t = /([^/]+)$/i
      , e = /\.([^/.]*)$/i
      , o = /^(?:([^:/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]*)(?::(\d*))?))?((((?:[^?#/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/;
    function c(A) {
        return A && 0 !== A.indexOf("data:image") ? o.exec(A) : []
    }
    let n = c(document.location.href);
    return {
        parse: function(o, c) {
            let n = A;
            n.setAttribute("href", o);
            let i = (n.pathname.match(t) || [])[1] || ""
              , r = i.split(".").map(A=>A.toLowerCase());
            i = decodeURIComponent(i.replace(e, "")),
            r.shift();
            let l = r[r.length - 1] || ""
              , a = {
                url: o,
                protocol: n.protocol,
                host: n.host,
                port: n.port,
                pathname: n.pathname,
                filename: i,
                ext: l,
                exts: r,
                hash: n.hash,
                search: n.search
            };
            return a.port || delete a.port,
            c && (a.query = {},
            n.search.replace(/^\?/, "").split(/&/).forEach(A=>{
                A = A.split("="),
                a.query[A[0]] = A[1]
            }
            )),
            a
        },
        parseParamString: function(A) {
            let t = {};
            return (A = A.replace(/^[#?]{1}/, "")).split("&").forEach(A=>{
                let e = A.split("=");
                coccoc_Utils.Utils.defined(e[0]) && coccoc_Utils.Utils.defined(e[1]) && (t[e[0]] = decodeURIComponent(e[1].replace(/\+/g, " ")))
            }
            ),
            t
        },
        format: function(t) {
            if ((t = Object.create(t)).query) {
                for (let A in t.search = [],
                t.query)
                    void 0 !== t.query[A] ? t.search.push(A + "=" + encodeURIComponent(t.query[A])) : t.search.push(A);
                t.search = "?" + t.search.join("&"),
                delete t.query
            }
            for (let e in t)
                A[e] = t[e];
            return A.href
        },
        parse0: c,
        resolve: function(A, t) {
            A = c(A),
            t || (t = n);
            let e = A[1]
              , o = A[2]
              , i = A[9]
              , r = A[12]
              , l = A[13];
            e || (e = t[1],
            o || (o = t[2],
            i ? "/" !== i.charAt(0) && (i = (t[10] || "/") + i) : (i = t[9],
            r || (r = t[12]))));
            let a = e + "://" + o + i;
            return r && (a += "?" + r),
            l && (a += "#" + l),
            a
        },
        getHost: function(A) {
            return c(A)[6] || ""
        },
        getMediaType: function(A) {
            let t = c(A)[11] || "";
            if (!t)
                return "";
            A.includes("googlevideo.com/videoplayback") && "videoplayback" === t && A.includes("mp4") && (t = "video.mp4"),
            A.includes("videoplayback") && "videoplayback" === t && A.includes("mp4") && (t = "video.mp4");
            let e = t.split(".")
              , o = e.length - 1;
            if (o <= 0)
                return "";
            let n = e[o].toLowerCase();
            return coccoc_Utils.MEDIA_EXTENSION_TYPE_MAP.get(n)
        }
    }
}
)(),
coccoc_Utils.Utils = {
    SIZES: ["B", "KB", "MB", "GB", "TB", "PB"],
    _BASE: -1 !== navigator.appVersion.indexOf("Win") ? 1024 : 1e3,
    xmlParser: new DOMParser,
    endsWith: function(A, t) {
        let e = A.length - t.length;
        return e >= 0 && A.indexOf(t, e) === e
    },
    hash: function(A, t) {
        if (t |= 0,
        0 === A.length)
            return t;
        let e, o;
        for (e = 0,
        o = A.length; e < o; e++)
            t = (t << 5) - t + A.charCodeAt(e),
            t |= 0;
        return t
    },
    query: function(A, t) {
        return (t = t || document).querySelector(A)
    },
    queryAll: function(A, t) {
        return t = t || document,
        coccoc_Utils.Utils.toArray(t.querySelectorAll(A))
    },
    findParent: function(A, t) {
        for (; null !== A && A.classList && !A.classList.contains(t); )
            A = A.parentNode;
        return A
    },
    nearestParent: function(A, t) {
        let e = A;
        for (; null !== e && e !== document && !e.matches(t); )
            e = e.parentNode;
        return document === e ? null : e
    },
    closest: function(A, t) {
        return A.matches(t) ? [A] : coccoc_Utils.Utils.queryAll(t, A)
    },
    getNodePropOrEmptyString: function(A, t) {
        return A && A[t] || ""
    },
    toArray: function(A) {
        return Array.prototype.slice.call(A)
    },
    unique: function(A) {
        let t = [];
        return Array.isArray(A) ? (A.forEach(A=>{
            -1 === t.indexOf(A) && t.push(A)
        }
        ),
        t) : A
    },
    extend: function(A, t) {
        let e = ()=>{}
        ;
        e.prototype = A.prototype,
        t.prototype = new e,
        t.prototype.constructor = t,
        t._super = A.prototype
    },
    extendObject: function(A) {
        return Array.prototype.forEach.call(Array.prototype.slice.call(arguments, 1), t=>{
            if (t)
                for (let e in t)
                    A[e] = t[e]
        }
        ),
        A
    },
    isMatches: function(A, t) {
        let e, o, c;
        if (Array.isArray(A)) {
            for (e = 0; e < A.length; ++e)
                if (coccoc_Utils.Utils.isMatches(A[e], t))
                    return !0;
            return !1
        }
        for (e = 0,
        o = (t = Array.isArray(t) ? t : [t]).length; e < o; ++e)
            if ("string" == typeof (c = t[e]) && -1 !== A.indexOf(c) || c instanceof RegExp && A.match(c))
                return !0;
        return !1
    },
    _sendBackgroundRequest: function(A, t, e, o) {
        return new Promise((c,n)=>{
            chrome.runtime.sendMessage({
                requestType: "make_http_request",
                method: A,
                url: t,
                params: e,
                headers: o
            }, A=>{
                A && "resolve" === A.success ? c(A.data) : n(A.data)
            }
            )
        }
        )
    },
    getYoutubeInfo: function(A) {
        return new Promise((t,e)=>{
            chrome.runtime.sendMessage({
                requestType: "youtube_get_info",
                method: "GET",
                url: A
            }, A=>{
                A.success ? t(A.data) : e(A.data)
            }
            )
        }
        )
    },
    send: function(A, t, e, o) {
        if (coccoc_Utils.Utils.IS_CONTENT_SCRIPT)
            return coccoc_Utils.Utils._sendBackgroundRequest(A, t, e, o);
        let c = null;
        const n = new Headers;
        if ("object" == typeof o)
            for (let A in o)
                n.append(A, o[A]);
        "object" == typeof e && (c = Object.keys(e).map(A=>A + "=" + e[A]).join("&")),
        "POST" === A && n.append("Content-type", "application/x-www-form-urlencoded");
        const i = {
            method: A,
            headers: n,
            cache: "reload",
            body: c || void 0
        };
        return window.fetch(t, i).then(A=>A.text())
    },
    get: function(A, t) {
        return coccoc_Utils.Utils.send("GET", A, {}, t)
    },
    post: function(A, t, e) {
        return coccoc_Utils.Utils.send("POST", A, t, e)
    },
    _getSize: function(A) {
        let t = null;
        const e = new XMLHttpRequest;
        return A = this.addProtocol(A),
        new Promise((o,c)=>{
            function n(A) {
                A ? o(A) : c(A),
                e.abort(),
                clearTimeout(t),
                t = null
            }
            e.open("GET", A),
            e.setRequestHeader("Cache-Control", "no-cache"),
            e.url = A,
            e.onreadystatechange = function() {
                if (this.readyState < 2)
                    return;
                let A = null;
                try {
                    A = +this.getResponseHeader("Content-Length"),
                    Number.isNaN(A) && (A = null)
                } catch (A) {}
                null === A && 200 !== this.status || (200 !== this.status && (A = null),
                n(A))
            }
            ,
            e.send(null),
            t = setTimeout(n, 1e4)
        }
        )
    },
    getSize: function(A) {
        return new Promise((t,e)=>{
            window.cache.get(A).then(e=>{
                if (!e)
                    return Promise.reject();
                t(e),
                window.cache.put(A, e)
            }
            ).catch(()=>{
                coccoc_Utils.Utils._getSize(A).then(e=>{
                    window.cache.put(A, e),
                    t(e)
                }
                ).catch(()=>{
                    console.error("Cannot request file size:", A),
                    e(null)
                }
                )
            }
            )
        }
        )
    },
    beautifyFileSize: function(A, t) {
        if (null === A || void 0 === A)
            return "???";
        let e, o = coccoc_Utils.Utils._BASE;
        for (e = 0; e < coccoc_Utils.Utils.SIZES.length && A >= o; ++e)
            A /= o;
        const c = coccoc_Utils.Utils.SIZES[e];
        let n = Math.round(10 * A) / 10;
        return t && c && "kb" === c.toLowerCase() && (n = n.toFixed(0)),
        n + coccoc_Utils.Utils.SIZES[e]
    },
    detectMediaTypeAndExt: function(A, t) {
        if (-1 !== ["application/x-mpegurl", "application/vnd.apple.mpegurl", "audio/x-mpegurl", "audio/mpegurl"].indexOf(t = t || ""))
            return A.type = "video",
            A.ext = "m3u8",
            A;
        let e = coccoc_Utils.Utils.getMediaType(t, A.exts);
        return e && coccoc_Utils.MEDIA_TYPES[e] && (A.type = e,
        A.ext = this._findIntersection(A.exts, coccoc_Utils.MEDIA_TYPES[e].extensions) || coccoc_Utils.Utils.extByContentType(t, e) || A.ext),
        A
    },
    getMediaType: function(A, t) {
        let e;
        for (let o in coccoc_Utils.MEDIA_TYPES) {
            if (e = coccoc_Utils.MEDIA_TYPES[o],
            A && A.match(e.rgxp))
                return o;
            if (Array.isArray(t) && coccoc_Utils.Utils._findIntersection(t, e.extensions) || -1 !== e.extensions.indexOf(t))
                return o
        }
        return null
    },
    _findIntersection: function(A, t) {
        let e = A.concat(t)
          , o = {};
        for (let A = 0; A < e.length; ++A) {
            let t = e[A];
            if (o[t])
                return t;
            o[t] = !0
        }
        return null
    },
    extByContentType: function(A, t) {
        let e = coccoc_Utils.MEDIA_TYPES[t].ctype2extension;
        for (let t in e)
            if (-1 !== A.indexOf(t))
                return e[t];
        return null
    },
    getProp: function(A, t) {
        return function A(t, e) {
            let o = e.shift();
            if (o && ("object" == typeof t || "function" == typeof t) && null !== t)
                return 0 === e.length ? t[o] : A(t[o], e)
        }(A, t.split("."))
    },
    call: function(A, t) {
        if (!A || A.length <= 0)
            return;
        let e = [].slice.call(arguments, 2);
        for (let o = 0; o < A.length; o++)
            A[o].apply(t, e)
    },
    isTrue: function(A) {
        return !!A
    },
    noop: function() {},
    defined: function(A) {
        return void 0 !== A
    },
    notNull: function(A) {
        return null !== A
    },
    debounce: function(A, t, e) {
        let o;
        return function() {
            let c = this
              , n = arguments;
            o ? clearTimeout(o) : e && A.apply(c, n),
            o = setTimeout(function() {
                e || A.apply(c, n),
                o = null
            }, t || 100)
        }
    },
    unescapeHTML: (()=>{
        let A;
        return t=>{
            (A = A || document.createElement("div")).innerHTML = ("" + t).replace(/</g, "&lt;");
            let e = A.firstChild.textContent;
            return A.innerHTML = "",
            e
        }
    }
    )(),
    replaceEntities: function(A) {
        let t = {
            "&amp;": "&"
        };
        return String(A).replace(/&amp;/g, A=>t[A])
    },
    isFullscreen: function() {
        return Boolean(document.fullscreenElement || document.webkitFullscreenElement)
    },
    splitMediaSourcesByTitle: function(A) {
        const t = new Map;
        return A.forEach(A=>{
            const e = A.title || A.filename;
            t.has(e) ? t.set(e, t.get(e).concat(A)) : t.set(e, [A])
        }
        ),
        t
    },
    flatten: function(A, t) {
        let e, o = Object.prototype.toString, c = [], n = t && A || A.slice();
        if (!A.length)
            return c;
        e = n.pop();
        do {
            "[object Array]" === o.call(e) ? n.push.apply(n, e) : c.push(e)
        } while (n.length && void 0 !== (e = n.pop()));return c.reverse(),
        c
    },
    addProtocol: function(A, t) {
        return A ? (void 0 === t && (t = "http"),
        "//" === A.slice(0, 2) ? t + ":" + A : A) : A
    },
    isDescendant(A, t) {
        for (t = t.parentNode; t && t !== A; )
            t = t.parentNode;
        return !!t
    },
    makeId(A) {
        let t = A.url
          , e = A.quality
          , o = !!A.soundOnly;
        return A = "object" == typeof t ? t.videoUrl + "\n" + t.audioUrl : t + (o ? "mp3_" + e : ""),
        coccoc_Utils.Utils.hash(A).toString()
    },
    checkVisible(A) {
        const t = A.getBoundingClientRect().top
          , e = A.getBoundingClientRect().bottom;
        return t >= 0 && e <= window.innerHeight
    },
    xpath: (()=>{
        return {
            forElement: function(A) {
                return A && A.id && !/\d/.test(A.id) ? "//" + A.tagName + '[@id="' + A.id + '"]' : function(A) {
                    let t = [];
                    for (; A && A.nodeType == Node.ELEMENT_NODE; A = A.parentNode) {
                        let e, o = 0, c = !1;
                        for (e = A.previousSibling; e; e = e.previousSibling)
                            e.nodeType != Node.DOCUMENT_TYPE_NODE && e.nodeName == A.nodeName && ++o;
                        for (e = A.nextSibling; e && !c; e = e.nextSibling)
                            e.nodeName == A.nodeName && (c = !0);
                        let n = (A.prefix ? A.prefix + ":" : "") + A.localName
                          , i = o || c ? "[" + (o + 1) + "]" : "";
                        t.splice(0, 0, n + i)
                    }
                    return t.length ? "/" + t.join("/") : null
                }(A)
            },
            find: function(A, t) {
                return t = t || document,
                document.evaluate(A, t, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
            }
        }
    }
    )(),
    dom: (()=>{
        function A(A, t) {
            return Object.keys(t).forEach(e=>{
                A.setAttribute(e, t[e])
            }
            ),
            A
        }
        function t(A, t) {
            return Object.keys(t).forEach(e=>{
                A.style[e] = t[e]
            }
            ),
            A
        }
        function e(A) {
            return A.split(";").reduce((A,t)=>{
                let e = t.indexOf(":");
                if (-1 !== e) {
                    let o = t.substr(0, e).trim()
                      , c = t.substr(e + 1).trim();
                    A[o] = c
                }
                return A
            }
            , {})
        }
        return {
            attr: function(t, e) {
                Array.isArray(t) ? t.forEach(t=>{
                    A(t, e)
                }
                ) : A(t, e)
            },
            style: function(A, e) {
                Array.isArray(A) ? A.forEach(A=>{
                    t(A, e)
                }
                ) : t(A, e)
            },
            setStyleAttr: function(A, t) {
                let o = A=>{
                    let o = A.getAttribute("style") || ""
                      , n = e(o);
                    for (let A in t)
                        t.hasOwnProperty(A) && (n[A] = t[A]);
                    let i = (c = n,
                    Object.keys(c).map(A=>A + ": " + c[A]).join("; ") + ";");
                    o !== i && A.setAttribute("style", i)
                }
                ;
                var c;
                Array.isArray(A) ? A.forEach(o) : o(A)
            },
            parseStyleAttr: e,
            parseHTML: function(A) {
                let t = document.createElement("div")
                  , e = document.createDocumentFragment();
                return t.innerHTML = A,
                [].slice.call(t.childNodes).forEach(e.appendChild, e),
                t = null,
                e
            },
            getOffset: function(A) {
                let t = {
                    top: 0,
                    left: 0,
                    height: A.offsetHeight,
                    width: A.offsetWidth
                };
                for (; A; )
                    t.left += A.offsetLeft,
                    t.top += A.offsetTop,
                    A = A.offsetParent;
                return t
            },
            getEmbedSize: function(A) {
                if (!(A instanceof HTMLElement))
                    return {
                        width: 0,
                        height: 0
                    };
                A.matches("embed") && A.parentNode.matches("object") && (A = A.parentNode);
                let t = A.querySelector("embed");
                return t && !adFilter.check(t) && t.offsetWidth && t.offsetHeight && (A = t),
                {
                    width: A.offsetWidth,
                    height: A.offsetHeight
                }
            }
        }
    }
    )(),
    g: (()=>{
        let A = new RegExp("^(www\\.)?google\\.((com|ac|ad|ae|al|am|as|at|az|ba|be|bf|bg|bi|bj|bs|bt|by|ca|cc|cd|cf|cat|cg|ch|ci|cl|cm|cn|cv|cz|de|dj|dk|ee|fi|dm|dz|es|fm|fr|ga|ge|gf|gg|gl|gm|gp|gr|gy|hn|hr|ht|hu|ir|iq|ie|im|io|is|it|je|ki|kg|jo|kz|la|lt|lu|lv|li|lk|md|me|mg|mk|ml|mn|ms|mu|mv|mw|nl|no|nr|nu|pl|ne|pn|ps|pt|ro|rs|ru|rw|sc|se|sh|si|sn|sm|so|tk|tl|tm|to|tn|st|sk|tt|td|vu|ws|vg|tg|us)|(co((\\.(th|id|il|in|jp|ke|ma|kr|mz|ls|nz|tz|ug|uk|uz|ve|vi|za|zm|zw|ao|ck|bw|cr))|m\\.(pr|py|qa|sa|sb|sg|sl|sv|tj|tn|tr|tw|gh|gi|gt|hk|jm|kw|lb|lc|ly|mm|mt|mx|my|na|nf|ng|ni|np|om|pa|pe|ph|pk|pg|ua|uy|vc|vn|af|ag|ai|ar|au|bd|bh|bn|bo|br|bz|kh|co|cu|cy|do|ec|eg|et|fj))))$","i")
          , t = /[&?]q=[^&]/i;
        return {
            isSERPHost: function(t) {
                return Boolean(t.match(A))
            },
            isSERPRequest: function(A) {
                let e = coccoc_Utils.UrlUtils.parse(A);
                return Boolean(this.isSERPHost(e.host) && e.pathname.match(/\/s(earch)?/i) && e.search.match(t))
            },
            getSearchParams: function(A) {
                let t = coccoc_Utils.UrlUtils.parse(A)
                  , e = coccoc_Utils.UrlUtils.parseParamString(t.search)
                  , o = coccoc_Utils.UrlUtils.parseParamString(t.hash || "#")
                  , c = coccoc_Utils.Utils.defined(o.q);
                return {
                    _rawSearch: e,
                    _rawHash: o,
                    q: c ? o.q : e.q || null,
                    s: c ? o.start || 0 : e.start || 0,
                    tbm: c ? o.tbm : e.tbm || null,
                    isXHR: e.tch,
                    isHash: c
                }
            }
        }
    }
    )()
};
var COCCOC_MESSAGE_CMD_PLAY = 1
  , COCCOC_MESSAGE_CMD_STOP = 2
  , COCCOC_MESSAGE_CMD_DOWNLOAD = 3
  , coccoc_JavaMessagePort = null
  , coccoc_VideoInPip = null
  , COCCOC_ZING_TV_HOST = /tv\.zing\.vn/
  , COCCOC_ZING_NEWS_HOST = /news\.zing\.vn/
  , COCCOC_YOUTUBE_HOST = /youtube\.com/
  , COCCOC_XVIDEOS_HOST = /xvideos\.com/
  , COCCOC_XNXX_HOST = /xnxx\.com/
  , COCCOC_BILUTV_HOST = /bilutv\.com/
  , COCCOC_PHIMBATHU_HOST = /phimbathu\.com/
  , COCCOC_ZING_HLS_SRC_RE = {
    "360p": /source:\s{0,}"(https?:\/\/.+\.mp4\?.+)"/
};
const COCCOC_HLS_DOWNLOAD_SUPPORT_HOSTS = [/^(.+\.)?tv\.zing\.vn/i, /^(?:(?!news).+\.)?zing\.vn/i, /^(.+\.)?xvideos\.com/i, /^(.+\.)?xnxx\.com/i];
function coccoc_parseMediaFromTV(A) {
    var t;
    return Object.keys(COCCOC_ZING_HLS_SRC_RE).map(function(t) {
        return {
            quality: t,
            match: A.match(COCCOC_ZING_HLS_SRC_RE[t])
        }
    }).forEach(function(A) {
        if (A.match && A.match.length > 1) {
            const e = coccoc_Utils.UrlUtils.parse(A.match[1]);
            t = coccoc_Utils.Utils.addProtocol(e.url, "https")
        }
    }),
    t
}
function coccoc_getWindowSize() {
    var A, t;
    return "number" == typeof window.innerWidth ? (A = window.innerWidth,
    t = window.innerHeight) : document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight) ? (A = document.documentElement.clientWidth,
    t = document.documentElement.clientHeight) : document.body && (document.body.clientWidth || document.body.clientHeight) && (A = document.body.clientWidth,
    t = document.body.clientHeight),
    {
        width: A,
        height: t
    }
}
window.addEventListener("message", function(A) {
    coccoc_JavaMessagePort || (coccoc_JavaMessagePort = A.ports[0]) && (coccoc_JavaMessagePort.onmessage = function(A) {
        var t = JSON.parse(A.data);
        if (t.command == COCCOC_MESSAGE_CMD_PLAY && coccoc_VideoInPip) {
            var e = t.playingTime;
            coccoc_VideoInPip.play();
            var o = function(A) {
                e > 0 && (coccoc_VideoInPip.currentTime = e),
                coccoc_VideoInPip.removeEventListener("playing", o),
                coccoc_VideoInPip = null
            };
            coccoc_VideoInPip.addEventListener("playing", o)
        }
    }
    )
}),
window.addEventListener("resize", function() {
    for (var A = document.getElementsByTagName("video"), t = 0; t < A.length; t++) {
        var e = A.item(t);
        if (e && e.pipButtonId) {
            var o = document.getElementById(e.pipButtonId);
            o && o.calculatePosition()
        }
    }
});
var coccoc_DomObserver = new window.WebKitMutationObserver(function(A) {
    A.forEach(function(A) {
        for (var t = Array.prototype.slice.call(A.removedNodes), e = 0; e < A.removedNodes.length; e++)
            if (t[e]instanceof Element && "VIDEO" == t[e].tagName) {
                var o = t[e];
                coccoc_removePipButtonFromVideo(o, A.target),
                coccoc_removeDownloadButtonFromVideo(o, A.target)
            }
        var c = Array.prototype.slice.call(A.addedNodes);
        for (e = 0; e < c.length; e++)
            if (c[e]instanceof Element) {
                if ("VIDEO" == c[e].tagName)
                    coccoc_shouldAddPip(o = c[e]) && coccoc_addPipButtonToVideo(o, A.target),
                    coccoc_shouldAddDownload(o) && coccoc_addDownloadButtonToVideo(o, A.target);
                for (var n = c[e].getElementsByTagName("video"), i = 0; i < n.length; i++) {
                    coccoc_shouldAddPip(o = n.item(i)) && coccoc_addPipButtonToVideo(o),
                    coccoc_shouldAddDownload(o) && coccoc_addDownloadButtonToVideo(o)
                }
            }
    })
}
);
function coccoc_shouldAddPip(A) {
    return coccoc_isVideoSrcValid(A) && !A.getAttribute("pipButton")
}
function coccoc_shouldAddDownload(A) {
    return coccoc_isDownloadSrcValid(A) && !A.getAttribute("downloadButton")
}
function coccoc_isVideoSrcValid(A) {
    var t = coccoc_getVideoSrc(A)
      , e = window.location.host
      , o = !0;
    return !(!!t && 0 === t.lastIndexOf("blob:", 0)) || e.match(COCCOC_ZING_TV_HOST) || e.match(COCCOC_YOUTUBE_HOST) || e.match(COCCOC_XVIDEOS_HOST) || e.match(COCCOC_XNXX_HOST) || (o = !1),
    e.match(COCCOC_XVIDEOS_HOST) || e.match(COCCOC_XNXX_HOST) ? -1 !== t.indexOf("videos/videopreview/") && (o = !1) : e.match(COCCOC_BILUTV_HOST) ? -1 !== t.indexOf("http://bilutv.com/uploads/1.mp4") && (o = !1) : e.match(COCCOC_PHIMBATHU_HOST) && -1 !== t.indexOf("https://phimbathu.com/uploads/1.mp4") && (o = !1),
    o
}
function coccoc_isDownloadSrcValid(A) {
    var t = coccoc_getDownloadSrc(A)
      , e = window.location.host
      , o = !0;
    return !window.location.host.match(COCCOC_YOUTUBE_HOST) && (!(t && 0 === t.lastIndexOf("blob:", 0) && !coccoc_isHostSupportedDownload(e)) && (e.match(COCCOC_XVIDEOS_HOST) || e.match(COCCOC_XNXX_HOST) ? -1 !== t.indexOf("videos/videopreview/") && (o = !1) : e.match(COCCOC_BILUTV_HOST) ? -1 !== t.indexOf("http://bilutv.com/uploads/1.mp4") && (o = !1) : e.match(COCCOC_PHIMBATHU_HOST) && -1 !== t.indexOf("https://phimbathu.com/uploads/1.mp4") && (o = !1),
    o))
}
function coccoc_isPipVisible(A) {
    var t = window.getComputedStyle(A)
      , e = coccoc_getVideoSrc(A);
    return A.offsetWidth > 10 && A.offsetHeight > 10 && 0 !== t.opacity && "none" !== t.display && "hidden" !== t.visibility && Boolean(e)
}
function coccoc_isDownloadVisible(A) {
    var t = window.getComputedStyle(A)
      , e = coccoc_getDownloadSrc(A);
    return A.offsetWidth > 10 && A.offsetHeight > 10 && 0 !== t.opacity && "none" !== t.display && "hidden" !== t.visibility && Boolean(e)
}
coccoc_DomObserver.observe(document, {
    childList: !0,
    subtree: !0
});
var coccoc_addPipButtonToVideo = function(A) {
    var t = coccoc_newPipButton(A);
    A.pipButtonId = t.id,
    A.setAttribute("pipButton", t.id),
    coccoc_addPipElement(t, A),
    t = document.getElementById(A.pipButtonId),
    A.addEventListener("play", function(A) {
        t.showButton()
    }),
    A.addEventListener("playing", function(e) {
        A.controls && t.hideButton()
    }),
    document.body.addEventListener("click", function(e) {
        coccoc_insideElement(e.clientX, e.clientY, A) && t.showButton()
    }),
    document.body.addEventListener("touchend", function(e) {
        coccoc_insideElement(e.changedTouches[0].pageX - window.scrollX, e.changedTouches[0].pageY - window.scrollY, A) && t.showButton()
    }),
    new window.WebKitMutationObserver(function(e) {
        e.forEach(function(e) {
            coccoc_isPipVisible(A) || t.hideButton(),
            t.calculatePosition()
        })
    }
    ).observe(A, {
        attributes: !0,
        characterData: !0
    })
}
  , coccoc_addDownloadButtonToVideo = function(A) {
    var t = coccoc_newDownloadButton(A);
    A.downloadButtonId = t.id,
    A.setAttribute("downloadButton", t.id),
    coccoc_addDownloadElement(t, A),
    t = document.getElementById(A.downloadButtonId),
    A.addEventListener("play", function(A) {
        t.showButton()
    }),
    A.addEventListener("playing", function(e) {
        A.controls && t.hideButton()
    }),
    document.body.addEventListener("click", function(e) {
        coccoc_insideElement(e.clientX, e.clientY, A) && t.showButton()
    }),
    document.body.addEventListener("touchend", function(e) {
        coccoc_insideElement(e.changedTouches[0].pageX - window.scrollX, e.changedTouches[0].pageY - window.scrollY, A) && t.showButton()
    }),
    new window.WebKitMutationObserver(function(e) {
        e.forEach(function(e) {
            coccoc_isDownloadVisible(A) || t.hideButton(),
            t.calculatePosition()
        })
    }
    ).observe(A, {
        attributes: !0,
        characterData: !0
    })
};
function coccoc_addPipElement(A) {
    A.calculatePosition(),
    A.style.zIndex = 2147483647,
    document.body.lastElementChild.insertAdjacentElement("afterend", A)
}
function coccoc_addDownloadElement(A) {
    A.calculatePosition(),
    A.style.zIndex = 2147483647,
    document.body.lastElementChild.insertAdjacentElement("afterend", A)
}
function coccoc_insideElement(A, t, e) {
    var o, c, n, i;
    if (document.webkitIsFullScreen) {
        o = n = 0;
        var r = coccoc_getWindowSize();
        c = r.height,
        i = r.width
    } else {
        var l = e.getBoundingClientRect();
        n = l.left,
        o = l.top,
        i = e.offsetWidth > 0 ? n + e.offsetWidth : n + parseInt(window.getComputedStyle(e).getPropertyValue("width"), 10),
        c = e.offsetHeight > 0 ? o + e.offsetHeight : o + parseInt(window.getComputedStyle(e).getPropertyValue("height"), 10)
    }
    return n <= A && A <= i && o <= t && t <= c
}
var coccoc_removePipButtonFromVideo = function(A) {
    if (A.pipButtonId) {
        var t = document.getElementById(A.pipButtonId);
        A.removeAttribute("pipButton"),
        document.body.removeChild(t)
    }
}
  , coccoc_removeDownloadButtonFromVideo = function(A) {
    if (A.downloadButtonId) {
        var t = document.getElementById(A.downloadButtonId);
        A.removeAttribute("downloadButton"),
        document.body.removeChild(t)
    }
}
  , coccoc_newPipButton = function(A) {
    var t = document.createElement("div");
    t.id = "PipButton_" + coccoc_generateUUID();
    var e = t.id + "_shadowfilter";
    return t.innerHTML = `<svg style="top:50%; bottom:50%; position:absolute; transform:translate(-50%, -50%);" fill="#e4e800" height="60%" viewBox="0 0 24 24" width="60%" xmlns="http://www.w3.org/2000/svg"><defs><filter id="${e}" style="color-interpolation-filters:sRGB"><feFlood result="flood" flood-opacity=".49804" flood-color="rgb(0,0,0)"/><feComposite operator="in" result="composite1" in2="SourceGraphic" in="flood"/><feGaussianBlur stdDeviation="1" result="blur" in="composite1"/><feOffset result="offset" dx="1.38778e-16" dy="1.38778e-16"/><feComposite operator="over" result="composite2" in2="offset" in="SourceGraphic"/></filter></defs><path d="m0 0h24v24h-24z" fill="none"/><path d="m5 3c-1.1 0-2 0.89971-2 1.9993v13.996c0 1.099 0.9 1.999 2 1.999h5.998v0.006h2v-0.006h6.002c1.1 0 2-0.89971 2-1.9993v-13.996c0-1.0993-0.9-1.999-2-1.999zm0 1.9993h14v6.0039h-6.002c-1.1 0-2 0.89971-2 1.9993v5.9922h-5.998zm7.998 8.0033h6.002v5.9922h-6.002z" filter="url(#${e})" stroke-width=".99984" fill="#fff"/></svg>`,
    t.setAttribute("style", "text-align:center; height:40px !important; width:40px !important; position: absolute !important; right:0px !important; top:0px !important;"),
    t.onclick = function(e) {
        t.isShowing || (e.stopPropagation(),
        coccoc_onPipButtonClicked(A))
    }
    ,
    coccoc_isPipVisible(A) || (t.style.display = "none"),
    t.showButton = function() {
        coccoc_isPipVisible(A) && coccoc_isVideoSrcValid(A) && ("none" == t.style.display && (t.isShowing = !0,
        setTimeout(function() {
            t.isShowing = !1
        }, 200)),
        t.style.display = "block",
        t.calculatePosition(),
        t.hidePipButtonTimeout && clearTimeout(t.hidePipButtonTimeout),
        t.hidePipButtonTimeout = setTimeout(function() {
            t.style.display = "none"
        }, 3e3))
    }
    ,
    t.hideButton = function() {
        t.style.display = "none"
    }
    ,
    t.calculatePosition = function() {
        var e, o, c, n;
        if (document.webkitIsFullScreen) {
            e = 0;
            var i = coccoc_getWindowSize();
            o = i.height,
            n = i.width
        } else {
            var r = A.getBoundingClientRect();
            c = r.left + window.scrollX,
            e = r.top + window.scrollY,
            n = A.offsetWidth > 0 ? c + A.offsetWidth : c + parseInt(window.getComputedStyle(A).getPropertyValue("width"), 10),
            o = A.offsetHeight > 0 ? e + A.offsetHeight : e + parseInt(window.getComputedStyle(A).getPropertyValue("height"), 10)
        }
        t.style.left = n - parseInt(t.style.width, 10) + "px",
        coccoc_isDownloadVisible(A) ? t.style.top = e + (o - e) / 2 - parseInt(t.style.height, 10) + "px" : t.style.top = e + (o - e - parseInt(t.style.height, 10)) / 2 + "px"
    }
    ,
    t
}
  , coccoc_newDownloadButton = function(A) {
    var t = document.createElement("div");
    return t.id = "DownloadButton_" + coccoc_generateUUID(),
    t.innerHTML = '<img style="top:50%; bottom:50%; position:absolute; transform:translate(-50%, -50%); width: 40px; height: 40px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4gEFCC0rH2M7vAAAIABJREFUeAEBUGSvmwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAAQAAAAIAAAACAAAAAgAAAAIAAAACAAAAAgAAAAAAAAABAAAAAAAAAP8AAAAAAAAA/gAAAP4AAAD+AAAA/gAAAP4AAAD+AAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAgAAAAMAAAAEAAAAAwAAAAQAAAADAAAAAgAAAAEAAAABAAAAAAAAAP8AAAD/AAAA/gAAAP0AAAD8AAAA/QAAAPwAAAAAAAAA/gAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAAwAAAAQAAAAFAAAABgAAAAUAAAAEAAAABAAAAAIAAAACAAAAAAAAAP4AAAD+AAAA/AAAAPwAAAD7AAAA+gAAAAAAAAAAAAAA/wAAAAEAAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAACAAAAAgAAAAUAAAAHAAAABwAAAAgAAAAGAAAABQAAAAMAAAACAAAAAAAAAP4AAAD9AAAA+wAAAPoAAAD4AAAAAQAAAAAAAAD+AAAAAgAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAABAAAABAAAAAUAAAAH////4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBIAAAAP4AAAD9AAAA/QAAAAAAAAABAAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAACAAAAAwAAAAUAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAUAAAADAAAAAgAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAACAAAAAgAAAAQAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAQAAAACAAAAAgAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAwAAAAMAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArq/thAAAgAElEQVQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAMAAAADAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAAIAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAIAAAABAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAQAAAAIAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAIAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAQAAAAEAAAABAAAAAQAAAAEAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAEAAAABAAAAAQAAAAEAAAABAAAAAAAAAAAAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAgAAAAQAAAAEAAAAAwAAAAMAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAMAAAADAAAABAAAAP0AAAD+AAAA/wAAAP8AAAD/AAAAAAAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAgAAAAIAAAABAAAAAwAAAAUAAAAFAAAABgAAAAUAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAUAAAAGAAAA+wAAAP4AAAD/AAAA/QAAAP8AAAD+AAAA/wAAAP0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAACAAAAAgAAAAMAAAADAAAABAAAAAcAAAAIAAAABwAAAAcAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAcAAAD6AAAA/QAAAAAAAAAAAAAA/AAAAP0AAAAAAAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAAwAAAAQAAAAFAAAABgAAAAgAAAAIAAAACgAAAAkAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAPsAAAD9AAAA/wAAAAEAAAABAAAA+gAAAPsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAACAAAAAwAAAAQAAAAGAAAABwAAAAkAAAAJAAAACgAAAAkAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAPwAAAD+AAAA/wAAAAEAAAD/AAAAAAAAAP8AAAD/AAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAIAAAADevr64H//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+zs7IkAAAANAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAIAAAADgAAABbh4eGH////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5OTkjgAAABYAAAAOAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAHAAAADQAAABUAAAAe19fXjf/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////b29uUAAAAHwAAABUAAAANAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAGAAAACwAAABIAAAAcAAAAJ9DQ0JL//////////////////////////////////////////////////////////////////////////////////////////////////////////9TU1JkAAAAnAAAAHAAAABMAAAAMAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAFAAAACQAAAA8AAAAXAAAAIQAAAC3MzMyV////////////////////////////////////////////////////////////////////////////////////////////////0NDQnAAAAC0AAAAiAAAAFwAAAA8AAAAJAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAADAAAABgAAAAsAAAASAAAAGgAAACUAAAAxyMjImP/////////////////////////////////////////////////////////////////////////////////////Nzc2eAAAAMQAAACUAAAAbAAAAEgAAAAsAAAAHAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAACAAAABAAAAAcAAAAMAAAAEwAAABwAAAAmAAAAMsjIyJj//////////////////////////////////////////////////////////////////////////83NzZ4AAAAzAAAAJwAAABwAAAATAAAADAAAAAcAAAAEAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAgAAAAQAAAAHAAAADAAAABMAAAAcAAAAJgAAADLIyMiY////////////////////////////////////////////////////////////////zc3NngAAADMAAAAnAAAAHAAAABMAAAAMAAAABwAAAAQAAAACAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAIAAAAEAAAABwAAAAwAAAATAAAAHAAAACYAAAAyyMjImP/////////////////////////////////////////////////////Nzc2eAAAAMwAAACcAAAAcAAAAEwAAAAwAAAAHAAAABAAAAAIAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAACAAAABAAAAAcAAAAMAAAAEwAAABwAAAAmAAAAMsjIyJj//////////////////////////////////////////83NzZ4AAAAyAAAAJwAAABwAAAATAAAADAAAAAcAAAAEAAAAAgAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAgAAAAQAAAAHAAAADAAAABMAAAAcAAAAJgAAADLJycmX////////////////////////////////zs7OnQAAADIAAAAmAAAAHAAAABMAAAAMAAAABwAAAAQAAAACAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAIAAAAEAAAABwAAAAwAAAATAAAAHAAAACUAAAAwzMzMlf/////////////////////R0dGbAAAAMAAAACYAAAAcAAAAEwAAAAwAAAAHAAAABAAAAAIAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAEAAAABAAAAAQAAAAIAAAADAAAABQAAAAgAAAANAAAAFAAAABwAAAAlAAAALNDQ0JL//////////9XV1ZgAAAAtAAAAJQAAABwAAAAUAAAADgAAAAkAAAAFAAAAAwAAAAIAAAABAAAAAQAAAAEAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAAQAAAAAAAAABAAAAAQAAAAEAAAAAAAAAAgAAAAIAAAADAAAABQAAAAYAAAAGAAAABgAAAAXb29tsAAAAACUlJZQAAAD7AAAA+gAAAPoAAAD6AAAA+wAAAP0AAAD+AAAA/gAAAAAAAAD/AAAA/wAAAP8AAAAAAAAA/wAAAP4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAACAAAAAgAAAAEAAAACAAAAAgAAAAEAAAABAAAAAQAAAAEAAAACAAAAAwAAAAQAAAAFAAAABAAAAAMAAAACAAAAAAAAAP4AAAD9AAAA/AAAAPsAAAD8AAAA/QAAAP4AAAD/AAAA/wAAAP8AAAD/AAAA/gAAAP4AAAD/AAAA/gAAAPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAACAAAAAwAAAAQAAAADAAAAAgAAAAIAAAACAAAAAQAAAAEAAAABAAAAAgAAAAIAAAADAAAAAgAAAAIAAAABAAAAAAAAAAIAAAAAAAAAAAAAAAEAAAAEAAAA/gAAAP8AAAD/AAAA/wAAAP4AAAD+AAAA/gAAAP0AAAD8AAAA/QAAAPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAEAAAABQAAAAUAAAAFAAAABAAAAAMAAAACAAAAAQAAAAEAAAAAAAAAAQAAAAIAAAABAAAAAgAAAAEAAAABAAAAAAAAAP8AAAD/AAAA/gAAAP8AAAD+AAAA/wAAAAAAAAD/AAAA/wAAAP4AAAD9AAAA/AAAAPsAAAACAAAA+wAAAPkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAC1X7xMAACAASURBVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAEAAAABQAAAAcAAAAGAAAABgAAAAQAAAADAAAAAQAAAAEAAAAAAAAAAQAAAAAAAAABAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAD/AAAAAAAAAP8AAAAAAAAA/wAAAAAAAAD/AAAA/wAAAP0AAAD8AAAA+gAAAAIAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAADAAAABf///+MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEbAAAA/QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP4AAAD9AAAA+wEBAR0AAAAGAAAABgAAAAQAAAADAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP0AAAD8AAAA+gAAAPoAAAD7AAAA/QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP4AAAD8AAAAAQAAAAAAAAD+AAAA/AAAAAMAAAACAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP4AAAD9AAAA/AAAAPsAAAD7AAAA/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP4AAAD8AAAA/wAAAP4AAAD8AAAAAwAAAAIAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD+AAAA/QAAAP0AAAD8AAAA/QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF5FoZAAABFtJREFUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALL+7XHzARe+AAAAAElFTkSuQmCC"/>',
    t.setAttribute("style", "text-align:center; height:40px !important; width:40px !important; position: absolute !important; right:0px !important; top:0px !important;"),
    t.onclick = function(e) {
        t.isShowing || (e.stopPropagation(),
        coccoc_onDownloadButtonClicked(A))
    }
    ,
    coccoc_isDownloadVisible(A) || (t.style.display = "none"),
    t.showButton = function() {
        coccoc_isDownloadVisible(A) && coccoc_isDownloadSrcValid(A) && ("none" == t.style.display && (t.isShowing = !0,
        setTimeout(function() {
            t.isShowing = !1
        }, 200)),
        t.style.display = "block",
        t.calculatePosition(),
        t.hidePipButtonTimeout && clearTimeout(t.hidePipButtonTimeout),
        t.hidePipButtonTimeout = setTimeout(function() {
            t.style.display = "none"
        }, 3e3))
    }
    ,
    t.hideButton = function() {
        t.style.display = "none"
    }
    ,
    t.calculatePosition = function() {
        var e, o, c, n;
        if (document.webkitIsFullScreen) {
            e = 0;
            var i = coccoc_getWindowSize();
            o = i.height,
            n = i.width
        } else {
            var r = A.getBoundingClientRect();
            c = r.left + window.scrollX,
            e = r.top + window.scrollY,
            n = A.offsetWidth > 0 ? c + A.offsetWidth : c + parseInt(window.getComputedStyle(A).getPropertyValue("width"), 10),
            o = A.offsetHeight > 0 ? e + A.offsetHeight : e + parseInt(window.getComputedStyle(A).getPropertyValue("height"), 10)
        }
        t.style.left = n - parseInt(t.style.width, 10) + "px",
        coccoc_isPipVisible(A) ? t.style.top = e + (o - e) / 2 + "px" : t.style.top = e + (o - e - parseInt(t.style.height, 10)) / 2 + "px"
    }
    ,
    t
};
function coccoc_generateUUID() {
    var A = Date.now();
    return "undefined" != typeof performance && "function" == typeof performance.now && (A += performance.now()),
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
        var e = (A + 16 * Math.random()) % 16 | 0;
        return A = Math.floor(A / 16),
        ("x" === t ? e : 3 & e | 8).toString(16)
    })
}
var coccoc_onPipButtonClicked = function(A) {
    var t = {};
    t.videoSrc = coccoc_getVideoSrc(A),
    t.playingTime = A.currentTime && A.currentTime > 0 ? A.currentTime : 0,
    t.command = COCCOC_MESSAGE_CMD_PLAY,
    A.videoWidth > 0 && A.videoHeight > 0 ? (t.videoWidth = A.videoWidth,
    t.videoHeight = A.videoHeight) : A.offsetWidth > 0 && A.offsetHeight > 0 && (t.videoWidth = A.offsetWidth,
    t.videoHeight = A.offsetHeight);
    var e = JSON.stringify(t);
    coccoc_JavaMessagePort && (coccoc_JavaMessagePort.postMessage(e),
    coccoc_VideoInPip = A,
    A.pause())
}
  , coccoc_onDownloadButtonClicked = function(A) {
    var t = {};
    t.videoSrc = coccoc_getDownloadSrc(A),
    t.playingTime = A.currentTime && A.currentTime > 0 ? A.currentTime : 0,
    t.command = COCCOC_MESSAGE_CMD_DOWNLOAD;
    var e = JSON.stringify(t);
    coccoc_JavaMessagePort && coccoc_JavaMessagePort.postMessage(e)
}
  , coccoc_getVideoSrc = function(A) {
    if (!A)
        return "";
    var t;
    if (A.src)
        t = A.src;
    else {
        var e = A.getElementsByTagName("source");
        if (e.length > 0) {
            for (var o = 0; o < e.length; o++)
                if (e[o] && e[o].type && "video/mp4" == e[o].type) {
                    t = e[o].src;
                    break
                }
            if (!t)
                for (o = 0; o < e.length; o++)
                    if (e[o] && e[o].type && -1 !== e[o].type.indexOf("video")) {
                        t = e[o].src;
                        break
                    }
            if (!t)
                for (o = 0; o < e.length; o++)
                    e[o] && e[o].src && (t = e[o].src)
        }
    }
    if (t && 0 === t.lastIndexOf("blob:", 0)) {
        var c = window.location.host;
        c.match(COCCOC_ZING_TV_HOST) ? t = coccoc_getZingTvUrl(t) : (c.match(COCCOC_XVIDEOS_HOST) || c.match(COCCOC_XNXX_HOST)) && (t = coccoc_getXvideosXnxxUrl(t))
    }
    return t || ""
}
  , coccoc_getDownloadSrc = function(A) {
    if (!A || window.location.host.match(COCCOC_YOUTUBE_HOST))
        return "";
    var t;
    if (A.src && coccoc_isDownloadableSrc(A.src))
        t = A.src;
    else {
        var e = A.getElementsByTagName("source");
        if (e.length > 0) {
            for (var o = 0; o < e.length; o++)
                if (e[o] && e[o].type && "video/mp4" == e[o].type) {
                    t = e[o].src;
                    break
                }
            if (!t)
                for (o = 0; o < e.length; o++)
                    if (e[o] && e[o].type && -1 !== e[o].type.indexOf("video") && coccoc_isDownloadableSrc(e[o].src)) {
                        t = e[o].src;
                        break
                    }
            if (!t)
                for (o = 0; o < e.length; o++)
                    if (coccoc_isDownloadableSrc(e[o].src)) {
                        t = e[o].src;
                        break
                    }
        }
    }
    if (t && 0 === t.lastIndexOf("blob:", 0)) {
        let A = window.location.host;
        A.match(COCCOC_ZING_TV_HOST || A.match(COCCOC_ZING_NEWS_HOST)) ? t = coccoc_getZingTvDownloadUrl(t) : (A.match(COCCOC_XVIDEOS_HOST) || A.match(COCCOC_XNXX_HOST)) && (t = coccoc_getXvideosXnxxDownloadUrl(t))
    }
    return t || ""
};
function coccoc_isDownloadableSrc(A) {
    return -1 === A.indexOf("youtube.com") && (!coccoc_Utils.isHls(A) || coccoc_isHostSupportedDownload(window.location.host))
}
function coccoc_isHostSupportedDownload(A) {
    return coccoc_Utils.Utils.isMatches(A, COCCOC_HLS_DOWNLOAD_SUPPORT_HOSTS)
}
var coccoc_getZingTvUrl = function(A) {
    return HTML5_PLAYER && HTML5_PLAYER.player && HTML5_PLAYER.player.playerInfo && HTML5_PLAYER.player.playerInfo.options && HTML5_PLAYER.player.playerInfo.options.sources ? HTML5_PLAYER.player.playerInfo.options.sources[0] : A
}
  , coccoc_getZingTvDownloadUrl = function(A) {
    return HTML5_PLAYER && HTML5_PLAYER.init ? coccoc_parseMediaFromTV(HTML5_PLAYER.init.toString()) : A
}
  , coccoc_getXvideosXnxxUrl = function(A) {
    if (html5player) {
        if (html5player.url_hls)
            return html5player.url_hls;
        if (html5player.url_high)
            return html5player.url_high;
        if (html5player.url_low)
            return html5player.url_low
    }
    return A
}
  , coccoc_getXvideosXnxxDownloadUrl = function(A) {
    if (html5player) {
        if (html5player.url_high)
            return html5player.url_high;
        if (html5player.url_low)
            return html5player.url_low
    }
    return A
}
  , coccoc_SearchAndAddCocCocButtons = function() {
    for (var A = document.getElementsByTagName("video"), t = 0; t < A.length; t++) {
        var e = A.item(t);
        coccoc_shouldAddPip(e) && coccoc_addPipButtonToVideo(e),
        coccoc_shouldAddDownload(e) && coccoc_addDownloadButtonToVideo(e)
    }
};
"complete" === document.readyState || "loaded" === document.readyState || "interactive" === document.readyState ? coccoc_SearchAndAddCocCocButtons() : document.addEventListener("DOMContentLoaded", function(A) {
    coccoc_SearchAndAddCocCocButtons()
});

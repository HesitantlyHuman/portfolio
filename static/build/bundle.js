
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    new Set();
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    new Map();

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    const _boolean_attributes = [
        'allowfullscreen',
        'allowpaymentrequest',
        'async',
        'autofocus',
        'autoplay',
        'checked',
        'controls',
        'default',
        'defer',
        'disabled',
        'formnovalidate',
        'hidden',
        'inert',
        'ismap',
        'loop',
        'multiple',
        'muted',
        'nomodule',
        'novalidate',
        'open',
        'playsinline',
        'readonly',
        'required',
        'reversed',
        'selected'
    ];
    /**
     * List of HTML boolean attributes (e.g. `<input disabled>`).
     * Source: https://html.spec.whatwg.org/multipage/indices.html
     */
    new Set([..._boolean_attributes]);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.58.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/Section.svelte generated by Svelte v3.58.0 */

    const file$f = "src/components/Section.svelte";

    // (7:4) {#if title}
    function create_if_block$2(ctx) {
    	let p;
    	let t1;
    	let h2;
    	let t2;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "=================================";
    			t1 = space();
    			h2 = element("h2");
    			t2 = text(/*title*/ ctx[0]);
    			attr_dev(p, "aria-hidden", "true");
    			attr_dev(p, "class", "svelte-1d3nohr");
    			add_location(p, file$f, 7, 8, 107);
    			attr_dev(h2, "class", "section-title svelte-1d3nohr");
    			attr_dev(h2, "tabindex", "-1");
    			add_location(h2, file$f, 8, 8, 175);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t2, /*title*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(7:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let section;
    	let t;
    	let current;
    	let if_block = /*title*/ ctx[0] && create_if_block$2(ctx);
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			section = element("section");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(section, "id", /*id*/ ctx[1]);
    			attr_dev(section, "class", "svelte-1d3nohr");
    			add_location(section, file$f, 5, 0, 68);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			if (if_block) if_block.m(section, null);
    			append_dev(section, t);

    			if (default_slot) {
    				default_slot.m(section, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(section, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 2) {
    				attr_dev(section, "id", /*id*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Section', slots, ['default']);
    	let { title = null } = $$props;
    	let { id } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (id === undefined && !('id' in $$props || $$self.$$.bound[$$self.$$.props['id']])) {
    			console.warn("<Section> was created without expected prop 'id'");
    		}
    	});

    	const writable_props = ['title', 'id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Section> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ title, id });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, id, $$scope, slots];
    }

    class Section extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { title: 0, id: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Section",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get title() {
    		throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/ContentList.svelte generated by Svelte v3.58.0 */

    const file$e = "src/components/ContentList.svelte";

    function create_fragment$f(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "svelte-1wrw7i6");
    			add_location(div, file$e, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ContentList', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ContentList> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class ContentList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContentList",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/components/Card.svelte generated by Svelte v3.58.0 */

    const file$d = "src/components/Card.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*hover*/ ctx[0] ? "hover" : "") + " svelte-1x4d6tu"));
    			add_location(div, file$d, 4, 0, 50);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*hover*/ 1 && div_class_value !== (div_class_value = "" + (null_to_empty(/*hover*/ ctx[0] ? "hover" : "") + " svelte-1x4d6tu"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, ['default']);
    	let { hover = false } = $$props;
    	const writable_props = ['hover'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('hover' in $$props) $$invalidate(0, hover = $$props.hover);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ hover });

    	$$self.$inject_state = $$props => {
    		if ('hover' in $$props) $$invalidate(0, hover = $$props.hover);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [hover, $$scope, slots];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { hover: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get hover() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Icon.svelte generated by Svelte v3.58.0 */

    const file$c = "src/components/Icon.svelte";

    // (208:0) {:else}
    function create_else_block(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*name*/ ctx[0]);
    			set_style(p, "font-size", /*size*/ ctx[1] - 1);
    			attr_dev(p, "class", "svelte-nrb7hp");
    			add_location(p, file$c, 208, 4, 11721);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 1) set_data_dev(t, /*name*/ ctx[0]);

    			if (dirty & /*size*/ 2) {
    				set_style(p, "font-size", /*size*/ ctx[1] - 1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(208:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (193:34) 
    function create_if_block_12(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "m19 9-7 7-7-7");
    			add_location(path, file$c, 201, 9, 11580);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "height", /*size*/ ctx[1]);
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "class", "h-6 w-6");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$c, 193, 4, 11374);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size*/ 2) {
    				attr_dev(svg, "height", /*size*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(193:34) ",
    		ctx
    	});

    	return block;
    }

    // (184:26) 
    function create_if_block_11(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M17.3 13.3A8 8 0 0 1 6.7 2.7a8 8 0 1 0 10.6 10.6z");
    			add_location(path, file$c, 190, 9, 11261);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-5 w-5");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "height", /*size*/ ctx[1]);
    			add_location(svg, file$c, 184, 4, 11102);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size*/ 2) {
    				attr_dev(svg, "height", /*size*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(184:26) ",
    		ctx
    	});

    	return block;
    }

    // (171:27) 
    function create_if_block_10(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "d", "M10 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm4 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm-.46 4.95.7.7a1 1 0 0 0 1.42-1.4l-.71-.71a1 1 0 0 0-1.41 1.41zm2.12-10.6a1 1 0 0 1 0 1.4l-.71.71a1 1 0 1 1-1.41-1.41l.7-.7a1 1 0 0 1 1.42 0zM17 11a1 1 0 1 0 0-2h-1a1 1 0 1 0 0 2h1zm-7 4a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zM5.05 6.46a1 1 0 1 0 1.42-1.41l-.71-.7a1 1 0 0 0-1.42 1.4l.71.71zm1.41 8.49-.7.7a1 1 0 0 1-1.42-1.4l.71-.71a1 1 0 0 1 1.41 1.41zM4 11a1 1 0 1 0 0-2H3a1 1 0 0 0 0 2h1z");
    			attr_dev(path, "clip-rule", "evenodd");
    			add_location(path, file$c, 177, 9, 10477);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-5 w-5");
    			attr_dev(svg, "viewBox", "1 1 18 18");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "height", /*size*/ ctx[1]);
    			add_location(svg, file$c, 171, 4, 10318);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size*/ 2) {
    				attr_dev(svg, "height", /*size*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(171:27) ",
    		ctx
    	});

    	return block;
    }

    // (155:27) 
    function create_if_block_9(ctx) {
    	let svg;
    	let path;
    	let svg_stroke_width_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z");
    			add_location(path, file$c, 164, 9, 10027);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");

    			attr_dev(svg, "stroke-width", svg_stroke_width_value = /*stroke_width*/ ctx[2]
    			? /*stroke_width*/ ctx[2]
    			: "0.095em");

    			attr_dev(svg, "height", /*size*/ ctx[1]);
    			attr_dev(svg, "class", "h-6 w-6");
    			attr_dev(svg, "viewBox", "2.2 3.2 19.7 17.4");
    			attr_dev(svg, "alt", "paper");
    			add_location(svg, file$c, 155, 4, 9755);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*stroke_width*/ 4 && svg_stroke_width_value !== (svg_stroke_width_value = /*stroke_width*/ ctx[2]
    			? /*stroke_width*/ ctx[2]
    			: "0.095em")) {
    				attr_dev(svg, "stroke-width", svg_stroke_width_value);
    			}

    			if (dirty & /*size*/ 2) {
    				attr_dev(svg, "height", /*size*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(155:27) ",
    		ctx
    	});

    	return block;
    }

    // (140:26) 
    function create_if_block_8(ctx) {
    	let svg;
    	let path;
    	let svg_stroke_width_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M13.8 10.2a4 4 0 0 0-5.6 0l-4 4a4 4 0 1 0 5.6 5.6l1.1-1m-.7-5a4 4 0 0 0 5.6 0l4-4a4 4 0 0 0-5.6-5.6l-1.1 1");
    			add_location(path, file$c, 148, 9, 9501);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");

    			attr_dev(svg, "stroke-width", svg_stroke_width_value = /*stroke_width*/ ctx[2]
    			? /*stroke_width*/ ctx[2]
    			: "0.125em");

    			attr_dev(svg, "height", /*size*/ ctx[1]);
    			attr_dev(svg, "class", "h-6 w-6");
    			attr_dev(svg, "viewBox", "1 2 20.8 20.8");
    			add_location(svg, file$c, 140, 4, 9253);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*stroke_width*/ 4 && svg_stroke_width_value !== (svg_stroke_width_value = /*stroke_width*/ ctx[2]
    			? /*stroke_width*/ ctx[2]
    			: "0.125em")) {
    				attr_dev(svg, "stroke-width", svg_stroke_width_value);
    			}

    			if (dirty & /*size*/ 2) {
    				attr_dev(svg, "height", /*size*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(140:26) ",
    		ctx
    	});

    	return block;
    }

    // (123:27) 
    function create_if_block_7(ctx) {
    	let svg;
    	let circle;
    	let mask;
    	let rect;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			circle = svg_element("circle");
    			mask = svg_element("mask");
    			rect = svg_element("rect");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(circle, "cx", "25.5");
    			attr_dev(circle, "cy", "24");
    			attr_dev(circle, "r", "29.5");
    			attr_dev(circle, "mask", "url(#a)");
    			add_location(circle, file$c, 130, 8, 8807);
    			attr_dev(rect, "width", "100%");
    			attr_dev(rect, "height", "100%");
    			attr_dev(rect, "x", "-4");
    			attr_dev(rect, "y", "-6");
    			attr_dev(rect, "fill", "#fff");
    			add_location(rect, file$c, 132, 13, 8906);
    			attr_dev(path0, "d", "m5.1 14.1 20.5 9.6 20.5-9.6A5 5 0 0 0 41 9.6H10.2a5 5 0 0 0-5 4.5Z");
    			add_location(path0, file$c, 132, 74, 8967);
    			attr_dev(path1, "d", "M46 19.5 25.7 29 5.1 19.5v14.1c0 2.7 2.3 4.8 5.1 4.8H41c2.8 0 5-2.1 5-4.8V19.5Z");
    			add_location(path1, file$c, 134, 14, 9074);
    			attr_dev(mask, "id", "a");
    			attr_dev(mask, "fill", "#000");
    			add_location(mask, file$c, 131, 8, 8868);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "-4 -6 60 60");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "height", /*size*/ ctx[1]);
    			attr_dev(svg, "alt", "email");
    			add_location(svg, file$c, 123, 4, 8645);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, circle);
    			append_dev(svg, mask);
    			append_dev(mask, rect);
    			append_dev(mask, path0);
    			append_dev(mask, path1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size*/ 2) {
    				attr_dev(svg, "height", /*size*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(123:27) ",
    		ctx
    	});

    	return block;
    }

    // (107:30) 
    function create_if_block_6(ctx) {
    	let svg;
    	let path;
    	let svg_stroke_width_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M3 16.5v2.3A2.3 2.3 0 0 0 5.3 21h13.4a2.3 2.3 0 0 0 2.3-2.3v-2.2M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3");
    			add_location(path, file$c, 116, 9, 8396);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");

    			attr_dev(svg, "stroke-width", svg_stroke_width_value = /*stroke_width*/ ctx[2]
    			? /*stroke_width*/ ctx[2]
    			: "0.125em");

    			attr_dev(svg, "height", /*size*/ ctx[1]);
    			attr_dev(svg, "class", "w-6 h-6");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "alt", "download");
    			add_location(svg, file$c, 107, 4, 8129);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*stroke_width*/ 4 && svg_stroke_width_value !== (svg_stroke_width_value = /*stroke_width*/ ctx[2]
    			? /*stroke_width*/ ctx[2]
    			: "0.125em")) {
    				attr_dev(svg, "stroke-width", svg_stroke_width_value);
    			}

    			if (dirty & /*size*/ 2) {
    				attr_dev(svg, "height", /*size*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(107:30) ",
    		ctx
    	});

    	return block;
    }

    // (95:26) 
    function create_if_block_5(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m47.78 31.6-1.34-.82a18.57 18.57 0 0 0-.04-.4l1.15-1.07a.46.46 0 0 0-.15-.77l-1.47-.56a16.8 16.8 0 0 0-.12-.38l.92-1.28a.46.46 0 0 0-.3-.72l-1.56-.26-.18-.35.65-1.43a.46.46 0 0 0-.44-.65l-1.58.05a12.48 12.48 0 0 0-.25-.3l.37-1.54a.46.46 0 0 0-.56-.56l-1.54.37-.3-.25.06-1.58a.46.46 0 0 0-.66-.44l-1.43.65a16.71 16.71 0 0 0-.35-.18l-.26-1.56a.46.46 0 0 0-.72-.3l-1.28.92a14.31 14.31 0 0 0-.38-.12l-.55-1.47a.46.46 0 0 0-.78-.16l-1.07 1.16-.4-.04-.83-1.34a.46.46 0 0 0-.78 0l-.83 1.34-.4.04-1.07-1.15a.46.46 0 0 0-.77.15l-.55 1.47-.38.12-1.28-.92a.46.46 0 0 0-.73.3l-.26 1.56-.35.18-1.43-.65a.46.46 0 0 0-.65.44l.05 1.58-.3.25-1.54-.37a.46.46 0 0 0-.56.56l.37 1.54-.25.3-1.58-.05a.46.46 0 0 0-.44.65l.65 1.44-.18.35-1.56.25a.46.46 0 0 0-.3.72l.92 1.28-.11.38-1.48.56a.46.46 0 0 0-.15.77l1.15 1.07-.04.4-1.34.83a.46.46 0 0 0 0 .78l1.34.83.04.4-1.15 1.07a.46.46 0 0 0 .15.78l1.48.55.11.38-.92 1.28a.46.46 0 0 0 .3.72l1.56.26.19.35-.66 1.43a.46.46 0 0 0 .44.66l1.58-.06.25.3-.37 1.54a.46.46 0 0 0 .56.56l1.54-.36.3.24-.05 1.58a.46.46 0 0 0 .65.44l1.44-.65.35.18.25 1.56a.46.46 0 0 0 .73.3l1.27-.92.38.12.56 1.47a.46.46 0 0 0 .77.15l1.08-1.15.39.04.83 1.34a.46.46 0 0 0 .78 0l.84-1.34.39-.04 1.07 1.15a.46.46 0 0 0 .77-.15l.56-1.47.38-.12 1.28.92a.46.46 0 0 0 .72-.3l.26-1.56.35-.18 1.43.65a.46.46 0 0 0 .66-.44l-.06-1.58.3-.24 1.54.36a.46.46 0 0 0 .56-.56l-.36-1.54.24-.3 1.58.06a.46.46 0 0 0 .44-.66l-.65-1.43.18-.35 1.56-.26a.46.46 0 0 0 .3-.72l-.92-1.28a17.5 17.5 0 0 0 .12-.38l1.47-.55a.46.46 0 0 0 .15-.78l-1.15-1.07.04-.4 1.34-.83a.46.46 0 0 0 0-.78zM38.8 42.76a.95.95 0 0 1 .4-1.86.95.95 0 0 1-.4 1.86zm-.46-3.08a.87.87 0 0 0-1.02.66l-.48 2.23A11.65 11.65 0 0 1 32 43.6c-1.76 0-3.43-.4-4.93-1.09l-.48-2.23a.87.87 0 0 0-1.02-.66l-1.97.42a11.68 11.68 0 0 1-1.02-1.2h9.57c.1 0 .18-.02.18-.12v-3.38c0-.1-.08-.12-.18-.12h-2.8v-2.14h3.02c.28 0 1.48.08 1.86 1.61.12.47.39 2 .57 2.5.18.55.91 1.65 1.69 1.65h4.76a.98.98 0 0 0 .18-.02c-.33.45-.7.88-1.09 1.27l-2-.43zM25.11 42.7a.95.95 0 0 1-.4-1.86.95.95 0 0 1 .4 1.87zM21.48 28a.95.95 0 1 1-1.73.77.95.95 0 1 1 1.73-.77zm-1.11 2.64 2.05-.9a.87.87 0 0 0 .44-1.15l-.43-.96h1.66v7.48h-3.34a11.71 11.71 0 0 1-.38-4.47zm8.98-.73v-2.2h3.95c.2 0 1.44.24 1.44 1.16 0 .77-.95 1.04-1.73 1.04h-3.66zM43.7 31.9l-.03.87h-1.2c-.12 0-.17.08-.17.2v.54c0 1.3-.73 1.58-1.37 1.66-.61.06-1.3-.26-1.37-.63-.37-2.03-.97-2.46-1.91-3.21 1.17-.75 2.4-1.85 2.4-3.32 0-1.6-1.1-2.6-1.84-3.1a5.21 5.21 0 0 0-2.51-.82H23.28a11.68 11.68 0 0 1 6.55-3.7l1.46 1.54c.33.35.88.36 1.23.03l1.64-1.56a11.71 11.71 0 0 1 8 5.7l-1.12 2.53a.87.87 0 0 0 .44 1.15l2.16.95c.04.39.06.77.06 1.17zM31.3 19.1a.95.95 0 0 1 1.34.02.95.95 0 0 1-.03 1.35.95.95 0 0 1-1.35-.03.95.95 0 0 1 .03-1.35zm11.12 8.94a.95.95 0 1 1 1.73.78.95.95 0 1 1-1.73-.78z");
    			add_location(path, file$c, 102, 8, 5309);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "16 16 32 32");
    			attr_dev(svg, "height", /*size*/ ctx[1]);
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "alt", "rust");
    			add_location(svg, file$c, 95, 4, 5148);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size*/ 2) {
    				attr_dev(svg, "height", /*size*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(95:26) ",
    		ctx
    	});

    	return block;
    }

    // (84:30) 
    function create_if_block_4(ctx) {
    	let svg;
    	let path;
    	let svg_fill_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M19 0H5a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V5a5 5 0 0 0-5-5zM8 19H5V8h3v11zM6.5 6.7c-1 0-1.8-.8-1.8-1.7s.8-1.8 1.8-1.8S8.3 4 8.3 5s-.8 1.7-1.8 1.7zM20 19h-3v-5.6c0-3.4-4-3.1-4 0V19h-3V8h3v1.8c1.4-2.6 7-2.8 7 2.4V19z");
    			add_location(path, file$c, 90, 9, 4845);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "height", /*size*/ ctx[1]);
    			attr_dev(svg, "fill", svg_fill_value = /*use_color*/ ctx[3] ? "currentColor" : "#2867B2");
    			attr_dev(svg, "alt", "linkedin");
    			add_location(svg, file$c, 84, 4, 4661);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size*/ 2) {
    				attr_dev(svg, "height", /*size*/ ctx[1]);
    			}

    			if (dirty & /*use_color*/ 8 && svg_fill_value !== (svg_fill_value = /*use_color*/ ctx[3] ? "currentColor" : "#2867B2")) {
    				attr_dev(svg, "fill", svg_fill_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(84:30) ",
    		ctx
    	});

    	return block;
    }

    // (73:28) 
    function create_if_block_3(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z");
    			add_location(path, file$c, 79, 9, 3882);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24.2 23.4");
    			attr_dev(svg, "height", /*size*/ ctx[1]);
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "alt", "github");
    			add_location(svg, file$c, 73, 4, 3722);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size*/ 2) {
    				attr_dev(svg, "height", /*size*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(73:28) ",
    		ctx
    	});

    	return block;
    }

    // (40:26) 
    function create_if_block_2(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;
    	let path5;
    	let path6;
    	let path7;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			path6 = svg_element("path");
    			path7 = svg_element("path");
    			attr_dev(path0, "fill", "#000");
    			attr_dev(path0, "d", "M50.5 86.74c-15.82 0-28.66-12.04-28.66-26.86l.06-15.75c0-8.65 9.03-16.07 18.25-16.07H62.6c8.27 0 16.57 8.32 16.57 16.07v15.75c0 14.82-12.84 26.86-28.66 26.86Z");
    			add_location(path0, file$c, 46, 9, 1918);
    			attr_dev(path1, "fill", "#E6E5E5");
    			attr_dev(path1, "d", "M50.5 83.14c-13.88 0-25.14-10.56-25.14-23.57V45.4c0-7.58 6.68-13.73 14.77-13.73H61.8c7.26 0 13.84 6.93 13.84 13.73v14.17c0 13-11.26 23.57-25.14 23.57Z");
    			add_location(path1, file$c, 49, 10, 2133);
    			attr_dev(path2, "fill", "#000");
    			attr_dev(path2, "d", "M50.53 17.34c1.28 0 2.32.97 2.32 2.15v10.02c0 1.19-1.04 2.16-2.33 2.16h-.14c-1.23 0-2.23-.93-2.23-2.07V19.42c0-1.15 1-2.08 2.24-2.08h.14Z");
    			add_location(path2, file$c, 52, 10, 2343);
    			attr_dev(path3, "fill", "#000");
    			attr_dev(path3, "d", "M50.5 7.93c5.16 0 9.34 3.92 9.34 8.76 0 4.83-4.18 8.75-9.34 8.75s-9.35-3.92-9.35-8.75c0-4.84 4.2-8.76 9.35-8.76Z");
    			add_location(path3, file$c, 55, 10, 2537);
    			attr_dev(path4, "fill", "#E83422");
    			attr_dev(path4, "d", "M50.5 11.35c3.14 0 5.69 2.4 5.69 5.34s-2.55 5.33-5.69 5.33c-3.14 0-5.69-2.4-5.69-5.33 0-2.95 2.55-5.34 5.69-5.34Z");
    			add_location(path4, file$c, 58, 10, 2706);
    			attr_dev(path5, "fill", "#697276");
    			attr_dev(path5, "d", "M30.6 63.56c5.24.99 9.26 4.93 10.08 9.87l1.38 8.34c-8.75-2.92-15.27-10.27-16.5-19.16l5.04.95Zm39.9 0c-5.23.99-9.25 4.93-10.07 9.87l-1.38 8.34C67.8 78.85 74.3 71.5 75.54 62.61l-5.04.95Z");
    			add_location(path5, file$c, 61, 10, 2879);
    			attr_dev(path6, "fill", "#000");
    			attr_dev(path6, "d", "M41.88 67.06c0-1.19 1.03-2.15 2.3-2.15h12.64c1.27 0 2.3.97 2.3 2.16 0 1.14-.99 2.06-2.2 2.06H44.09c-1.22 0-2.21-.93-2.21-2.07ZM29.96 49.78c0-2.67 2.32-4.84 5.18-4.84h31.05c2.68 0 4.85 2.03 4.85 4.54v7.02c0 2.51-2.18 4.55-4.87 4.55H35.15c-2.87 0-5.19-2.17-5.19-4.85v-6.42Z");
    			add_location(path6, file$c, 64, 10, 3123);
    			attr_dev(path7, "fill", "#33BBD9");
    			attr_dev(path7, "d", "M38.12 50.59c0-1.57 1.36-2.84 3.05-2.84h.02c1.68 0 3.05 1.27 3.05 2.84v4.99h-6.12v-5Zm18.64 0c0-1.57 1.37-2.84 3.05-2.84h.02c1.69 0 3.05 1.27 3.05 2.84v4.99h-6.12v-5Z");
    			add_location(path7, file$c, 67, 10, 3451);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "11.5 8 79 79");
    			attr_dev(svg, "height", /*size*/ ctx[1]);
    			attr_dev(svg, "alt", "hesitantly human");
    			add_location(svg, file$c, 40, 4, 1757);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(svg, path3);
    			append_dev(svg, path4);
    			append_dev(svg, path5);
    			append_dev(svg, path6);
    			append_dev(svg, path7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size*/ 2) {
    				attr_dev(svg, "height", /*size*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(40:26) ",
    		ctx
    	});

    	return block;
    }

    // (22:29) 
    function create_if_block_1$1(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "m63.1 28.3-6.6 6.6a27.3 27.3 0 0 1 0 38.8 27.3 27.3 0 0 1-38.8 0 27.3 27.3 0 0 1 0-38.8l17.1-17.1 2.4-2.4V2.5L11.4 28.3a36.7 36.7 0 0 0 0 52 36.3 36.3 0 0 0 51.7 0 36.7 36.7 0 0 0 0-52Z");
    			set_style(path0, "stroke", "none");
    			set_style(path0, "stroke-width", "1");
    			set_style(path0, "stroke-dasharray", "none");
    			set_style(path0, "stroke-linecap", "butt");
    			set_style(path0, "stroke-dashoffset", "0");
    			set_style(path0, "stroke-linejoin", "miter");
    			set_style(path0, "stroke-miterlimit", "4");
    			set_style(path0, "fill-rule", "nonzero");
    			set_style(path0, "opacity", "1");
    			attr_dev(path0, "transform", "translate(282.9 193.5)");
    			add_location(path0, file$c, 29, 9, 962);
    			attr_dev(path1, "d", "M55 21.9a4.8 4.8 0 1 1-9.6 0 4.8 4.8 0 0 1 9.6 0Z");
    			set_style(path1, "stroke", "none");
    			set_style(path1, "stroke-width", "1");
    			set_style(path1, "stroke-dasharray", "none");
    			set_style(path1, "stroke-linecap", "butt");
    			set_style(path1, "stroke-dashoffset", "0");
    			set_style(path1, "stroke-linejoin", "miter");
    			set_style(path1, "stroke-miterlimit", "4");
    			set_style(path1, "fill-rule", "nonzero");
    			set_style(path1, "opacity", "1");
    			attr_dev(path1, "transform", "translate(282.9 193.5)");
    			add_location(path1, file$c, 33, 10, 1406);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xml:space", "preserve");
    			attr_dev(svg, "viewBox", "278 200 85 85");
    			attr_dev(svg, "height", /*size*/ ctx[1]);
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "alt", "pytorch");
    			add_location(svg, file$c, 22, 4, 772);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size*/ 2) {
    				attr_dev(svg, "height", /*size*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(22:29) ",
    		ctx
    	});

    	return block;
    }

    // (10:0) {#if name === "python"}
    function create_if_block$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M13 3a4 4 0 0 0-4 4v1h5a1 1 0 0 1 0 2H7a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h1v-5a3 3 0 0 1 3-3h8a1 1 0 0 0 1-1V7a4 4 0 0 0-4-4h-3zm-1 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm10 3v5a3 3 0 0 1-3 3h-8a1 1 0 0 0-1 1v6a4 4 0 0 0 4 4h3a4 4 0 0 0 4-4v-1h-5a1 1 0 0 1 0-2h7a4 4 0 0 0 4-4v-4a4 4 0 0 0-4-4h-1zm-4 15a1 1 0 1 1 0 2 1 1 0 0 1 0-2z");
    			add_location(path, file$c, 17, 8, 373);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "3 3 24.5 24.5");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "height", /*size*/ ctx[1]);
    			attr_dev(svg, "alt", "python");
    			add_location(svg, file$c, 10, 4, 208);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size*/ 2) {
    				attr_dev(svg, "height", /*size*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(10:0) {#if name === \\\"python\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*name*/ ctx[0] === "python") return create_if_block$1;
    		if (/*name*/ ctx[0] === "pytorch") return create_if_block_1$1;
    		if (/*name*/ ctx[0] === "logo") return create_if_block_2;
    		if (/*name*/ ctx[0] === "github") return create_if_block_3;
    		if (/*name*/ ctx[0] === "linkedin") return create_if_block_4;
    		if (/*name*/ ctx[0] === "rust") return create_if_block_5;
    		if (/*name*/ ctx[0] === "download") return create_if_block_6;
    		if (/*name*/ ctx[0] === "email") return create_if_block_7;
    		if (/*name*/ ctx[0] === "link") return create_if_block_8;
    		if (/*name*/ ctx[0] === "paper") return create_if_block_9;
    		if (/*name*/ ctx[0] === "light") return create_if_block_10;
    		if (/*name*/ ctx[0] === "dark") return create_if_block_11;
    		if (/*name*/ ctx[0] === "chevron-down") return create_if_block_12;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);
    	let { name = "link" } = $$props;
    	let { size = "2em" } = $$props;
    	let { stroke_width = null } = $$props;
    	let { use_color = true } = $$props;
    	name = name.toLowerCase();
    	const writable_props = ['name', 'size', 'stroke_width', 'use_color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('stroke_width' in $$props) $$invalidate(2, stroke_width = $$props.stroke_width);
    		if ('use_color' in $$props) $$invalidate(3, use_color = $$props.use_color);
    	};

    	$$self.$capture_state = () => ({ name, size, stroke_width, use_color });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('stroke_width' in $$props) $$invalidate(2, stroke_width = $$props.stroke_width);
    		if ('use_color' in $$props) $$invalidate(3, use_color = $$props.use_color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, size, stroke_width, use_color];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			name: 0,
    			size: 1,
    			stroke_width: 2,
    			use_color: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get name() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke_width() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke_width(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get use_color() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use_color(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Project.svelte generated by Svelte v3.58.0 */
    const file$b = "src/components/Project.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (24:20) {#each techs as tech}
    function create_each_block_1(ctx) {
    	let li;
    	let icon;
    	let t;
    	let current;

    	icon = new Icon({
    			props: {
    				name: /*tech*/ ctx[10].toLowerCase(),
    				size: "1.8em"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(icon.$$.fragment);
    			t = space();
    			attr_dev(li, "class", "svelte-ljz3pi");
    			add_location(li, file$b, 24, 24, 714);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(icon, li, null);
    			append_dev(li, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty & /*techs*/ 4) icon_changes.name = /*tech*/ ctx[10].toLowerCase();
    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(24:20) {#each techs as tech}",
    		ctx
    	});

    	return block;
    }

    // (34:20) {#each links as link}
    function create_each_block$4(ctx) {
    	let li;
    	let a;
    	let icon;
    	let a_href_value;
    	let t;
    	let current;

    	icon = new Icon({
    			props: {
    				name: /*link*/ ctx[7].name.toLowerCase(),
    				size: "2em"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			create_component(icon.$$.fragment);
    			t = space();
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[7].url);
    			attr_dev(a, "class", "svelte-ljz3pi");
    			add_location(a, file$b, 35, 28, 1108);
    			attr_dev(li, "class", "svelte-ljz3pi");
    			add_location(li, file$b, 34, 24, 1075);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			mount_component(icon, a, null);
    			append_dev(li, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty & /*links*/ 64) icon_changes.name = /*link*/ ctx[7].name.toLowerCase();
    			icon.$set(icon_changes);

    			if (!current || dirty & /*links*/ 64 && a_href_value !== (a_href_value = /*link*/ ctx[7].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(34:20) {#each links as link}",
    		ctx
    	});

    	return block;
    }

    // (14:0) <Card hover={true}>
    function create_default_slot$7(ctx) {
    	let article;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h3;
    	let t1;
    	let t2;
    	let aside;
    	let h4;
    	let t3_value = /*category*/ ctx[1].toUpperCase() + "";
    	let t3;
    	let t4;
    	let ul0;
    	let t5;
    	let summary;
    	let p0;
    	let t6;
    	let t7;
    	let footer;
    	let ul1;
    	let t8;
    	let p1;
    	let current;
    	let each_value_1 = /*techs*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*links*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			article = element("article");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h3 = element("h3");
    			t1 = text(/*name*/ ctx[0]);
    			t2 = space();
    			aside = element("aside");
    			h4 = element("h4");
    			t3 = text(t3_value);
    			t4 = space();
    			ul0 = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t5 = space();
    			summary = element("summary");
    			p0 = element("p");
    			t6 = text(/*description*/ ctx[3]);
    			t7 = space();
    			footer = element("footer");
    			ul1 = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			p1 = element("p");
    			p1.textContent = "Read more >";
    			if (!src_url_equal(img.src, img_src_value = /*image*/ ctx[4])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*image_alt*/ ctx[5]);
    			attr_dev(img, "class", "svelte-ljz3pi");
    			add_location(img, file$b, 16, 12, 432);
    			attr_dev(div0, "class", "image svelte-ljz3pi");
    			add_location(div0, file$b, 15, 8, 400);
    			attr_dev(h3, "class", "svelte-ljz3pi");
    			add_location(h3, file$b, 19, 12, 522);
    			attr_dev(h4, "class", "svelte-ljz3pi");
    			add_location(h4, file$b, 21, 16, 574);
    			attr_dev(ul0, "class", "tech-icons svelte-ljz3pi");
    			add_location(ul0, file$b, 22, 16, 624);
    			attr_dev(aside, "class", "svelte-ljz3pi");
    			add_location(aside, file$b, 20, 12, 550);
    			attr_dev(p0, "class", "svelte-ljz3pi");
    			add_location(p0, file$b, 30, 21, 917);
    			attr_dev(summary, "class", "svelte-ljz3pi");
    			add_location(summary, file$b, 30, 12, 908);
    			attr_dev(ul1, "class", "link-icons svelte-ljz3pi");
    			add_location(ul1, file$b, 32, 16, 985);
    			attr_dev(p1, "class", "svelte-ljz3pi");
    			add_location(p1, file$b, 44, 16, 1444);
    			attr_dev(footer, "class", "svelte-ljz3pi");
    			add_location(footer, file$b, 31, 12, 960);
    			attr_dev(div1, "class", "info svelte-ljz3pi");
    			add_location(div1, file$b, 18, 8, 491);
    			attr_dev(article, "class", "svelte-ljz3pi");
    			add_location(article, file$b, 14, 4, 382);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, div0);
    			append_dev(div0, img);
    			append_dev(article, t0);
    			append_dev(article, div1);
    			append_dev(div1, h3);
    			append_dev(h3, t1);
    			append_dev(div1, t2);
    			append_dev(div1, aside);
    			append_dev(aside, h4);
    			append_dev(h4, t3);
    			append_dev(aside, t4);
    			append_dev(aside, ul0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(ul0, null);
    				}
    			}

    			append_dev(div1, t5);
    			append_dev(div1, summary);
    			append_dev(summary, p0);
    			append_dev(p0, t6);
    			append_dev(div1, t7);
    			append_dev(div1, footer);
    			append_dev(footer, ul1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul1, null);
    				}
    			}

    			append_dev(footer, t8);
    			append_dev(footer, p1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*image*/ 16 && !src_url_equal(img.src, img_src_value = /*image*/ ctx[4])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*image_alt*/ 32) {
    				attr_dev(img, "alt", /*image_alt*/ ctx[5]);
    			}

    			if (!current || dirty & /*name*/ 1) set_data_dev(t1, /*name*/ ctx[0]);
    			if ((!current || dirty & /*category*/ 2) && t3_value !== (t3_value = /*category*/ ctx[1].toUpperCase() + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*techs*/ 4) {
    				each_value_1 = /*techs*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(ul0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*description*/ 8) set_data_dev(t6, /*description*/ ctx[3]);

    			if (dirty & /*links*/ 64) {
    				each_value = /*links*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(14:0) <Card hover={true}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				hover: true,
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card_changes = {};

    			if (dirty & /*$$scope, links, description, techs, category, name, image, image_alt*/ 8319) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Project', slots, []);
    	let { name = "Project Name" } = $$props;
    	let { category = "Project Category" } = $$props;
    	let { techs = [] } = $$props;
    	let { description = "Project Description" } = $$props;
    	let { image = "" } = $$props;
    	let { image_alt = "Project Image" } = $$props;
    	let { links = [] } = $$props;
    	const writable_props = ['name', 'category', 'techs', 'description', 'image', 'image_alt', 'links'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Project> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('category' in $$props) $$invalidate(1, category = $$props.category);
    		if ('techs' in $$props) $$invalidate(2, techs = $$props.techs);
    		if ('description' in $$props) $$invalidate(3, description = $$props.description);
    		if ('image' in $$props) $$invalidate(4, image = $$props.image);
    		if ('image_alt' in $$props) $$invalidate(5, image_alt = $$props.image_alt);
    		if ('links' in $$props) $$invalidate(6, links = $$props.links);
    	};

    	$$self.$capture_state = () => ({
    		Card,
    		Icon,
    		name,
    		category,
    		techs,
    		description,
    		image,
    		image_alt,
    		links
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('category' in $$props) $$invalidate(1, category = $$props.category);
    		if ('techs' in $$props) $$invalidate(2, techs = $$props.techs);
    		if ('description' in $$props) $$invalidate(3, description = $$props.description);
    		if ('image' in $$props) $$invalidate(4, image = $$props.image);
    		if ('image_alt' in $$props) $$invalidate(5, image_alt = $$props.image_alt);
    		if ('links' in $$props) $$invalidate(6, links = $$props.links);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, category, techs, description, image, image_alt, links];
    }

    class Project extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			name: 0,
    			category: 1,
    			techs: 2,
    			description: 3,
    			image: 4,
    			image_alt: 5,
    			links: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Project",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get name() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get category() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set category(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get techs() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set techs(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get image() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get image_alt() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image_alt(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get links() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set links(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Filter.svelte generated by Svelte v3.58.0 */

    const { Object: Object_1$1 } = globals;
    const file$a = "src/components/Filter.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (49:4) {#if dropdown_open}
    function create_if_block(ctx) {
    	let ul;
    	let current;
    	let each_value = /*possible_filter_items*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-n4ld8a");
    			add_location(ul, file$a, 49, 8, 1354);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*filter_state, possible_filter_items, toggleFilter, use_icons*/ 53) {
    				each_value = /*possible_filter_items*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(49:4) {#if dropdown_open}",
    		ctx
    	});

    	return block;
    }

    // (66:24) {#if use_icons && filter_item != "all"}
    function create_if_block_1(ctx) {
    	let div;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				name: /*filter_item*/ ctx[9],
    				size: "1.2em"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div, "class", "filter-icon svelte-n4ld8a");
    			add_location(div, file$a, 66, 28, 2091);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(66:24) {#if use_icons && filter_item != \\\"all\\\"}",
    		ctx
    	});

    	return block;
    }

    // (51:12) {#each possible_filter_items as filter_item}
    function create_each_block$3(ctx) {
    	let button;
    	let li;
    	let div;
    	let div_class_value;
    	let t0;
    	let h4;
    	let t1_value = /*filter_item*/ ctx[9].toUpperCase() + "";
    	let t1;
    	let t2;
    	let t3;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*use_icons*/ ctx[2] && /*filter_item*/ ctx[9] != "all" && create_if_block_1(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[8](/*filter_item*/ ctx[9]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			li = element("li");
    			div = element("div");
    			t0 = space();
    			h4 = element("h4");
    			t1 = text(t1_value);
    			t2 = space();
    			if (if_block) if_block.c();
    			t3 = space();

    			attr_dev(div, "class", div_class_value = "filter-checkbox " + (/*filter_state*/ ctx[0][/*filter_item*/ ctx[9]]
    			? 'checkbox-on'
    			: 'checkbox-off') + " svelte-n4ld8a");

    			add_location(div, file$a, 59, 24, 1729);
    			attr_dev(h4, "class", "svelte-n4ld8a");
    			add_location(h4, file$a, 64, 24, 1962);
    			attr_dev(li, "class", "svelte-n4ld8a");
    			add_location(li, file$a, 58, 20, 1700);
    			attr_dev(button, "type", "checkbox");

    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*filter_state*/ ctx[0][/*filter_item*/ ctx[9]]
    			? ""
    			: "filter-off") + " svelte-n4ld8a"));

    			add_location(button, file$a, 51, 16, 1432);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, li);
    			append_dev(li, div);
    			append_dev(li, t0);
    			append_dev(li, h4);
    			append_dev(h4, t1);
    			append_dev(li, t2);
    			if (if_block) if_block.m(li, null);
    			append_dev(button, t3);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty & /*filter_state*/ 1 && div_class_value !== (div_class_value = "filter-checkbox " + (/*filter_state*/ ctx[0][/*filter_item*/ ctx[9]]
    			? 'checkbox-on'
    			: 'checkbox-off') + " svelte-n4ld8a")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (/*use_icons*/ ctx[2] && /*filter_item*/ ctx[9] != "all") {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*use_icons*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(li, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*filter_state*/ 1 && button_class_value !== (button_class_value = "" + (null_to_empty(/*filter_state*/ ctx[0][/*filter_item*/ ctx[9]]
    			? ""
    			: "filter-off") + " svelte-n4ld8a"))) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(51:12) {#each possible_filter_items as filter_item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div1;
    	let button;
    	let h4;
    	let t0;
    	let t1;
    	let div0;
    	let icon;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: { name: "chevron-down", size: "1em" },
    			$$inline: true
    		});

    	let if_block = /*dropdown_open*/ ctx[3] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			button = element("button");
    			h4 = element("h4");
    			t0 = text(/*filter_name*/ ctx[1]);
    			t1 = space();
    			div0 = element("div");
    			create_component(icon.$$.fragment);
    			t2 = space();
    			if (if_block) if_block.c();
    			attr_dev(h4, "class", "svelte-n4ld8a");
    			add_location(h4, file$a, 43, 8, 1181);
    			attr_dev(div0, "class", "dropdown-arrow svelte-n4ld8a");
    			add_location(div0, file$a, 44, 8, 1212);
    			attr_dev(button, "class", "dropdown-header svelte-n4ld8a");
    			add_location(button, file$a, 42, 4, 1114);
    			attr_dev(div1, "class", "dropdown svelte-n4ld8a");
    			add_location(div1, file$a, 41, 0, 1087);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button);
    			append_dev(button, h4);
    			append_dev(h4, t0);
    			append_dev(button, t1);
    			append_dev(button, div0);
    			mount_component(icon, div0, null);
    			append_dev(div1, t2);
    			if (if_block) if_block.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*toggleDropdown*/ ctx[6], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*filter_name*/ 2) set_data_dev(t0, /*filter_name*/ ctx[1]);

    			if (/*dropdown_open*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*dropdown_open*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(icon);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Filter', slots, []);
    	let { filter_name } = $$props;
    	let { use_icons = false } = $$props;
    	let { filter_options = [] } = $$props;
    	let { filter_state = {} } = $$props;

    	for (let filter_name of filter_options) {
    		filter_state[filter_name] = true;
    	}

    	filter_state["all"] = true;
    	let possible_filter_items = filter_options;
    	possible_filter_items.splice(0, 0, "all");

    	function toggleFilter(filter_name) {
    		if (filter_name == "all") {
    			for (let filter_name of possible_filter_items) {
    				$$invalidate(0, filter_state[filter_name] = true, filter_state);
    			}
    		} else {
    			$$invalidate(0, filter_state["all"] = false, filter_state);
    			$$invalidate(0, filter_state[filter_name] = !filter_state[filter_name], filter_state);
    		}

    		$$invalidate(7, filter_options = Object.keys(filter_state).filter(filter_name => filter_state[filter_name]));
    		$$invalidate(0, filter_state);
    	}

    	let dropdown_open = false;

    	function toggleDropdown() {
    		$$invalidate(3, dropdown_open = !dropdown_open);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (filter_name === undefined && !('filter_name' in $$props || $$self.$$.bound[$$self.$$.props['filter_name']])) {
    			console.warn("<Filter> was created without expected prop 'filter_name'");
    		}
    	});

    	const writable_props = ['filter_name', 'use_icons', 'filter_options', 'filter_state'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Filter> was created with unknown prop '${key}'`);
    	});

    	const click_handler = filter_item => {
    		toggleFilter(filter_item);
    	};

    	$$self.$$set = $$props => {
    		if ('filter_name' in $$props) $$invalidate(1, filter_name = $$props.filter_name);
    		if ('use_icons' in $$props) $$invalidate(2, use_icons = $$props.use_icons);
    		if ('filter_options' in $$props) $$invalidate(7, filter_options = $$props.filter_options);
    		if ('filter_state' in $$props) $$invalidate(0, filter_state = $$props.filter_state);
    	};

    	$$self.$capture_state = () => ({
    		Card,
    		Icon,
    		filter_name,
    		use_icons,
    		filter_options,
    		filter_state,
    		possible_filter_items,
    		toggleFilter,
    		dropdown_open,
    		toggleDropdown
    	});

    	$$self.$inject_state = $$props => {
    		if ('filter_name' in $$props) $$invalidate(1, filter_name = $$props.filter_name);
    		if ('use_icons' in $$props) $$invalidate(2, use_icons = $$props.use_icons);
    		if ('filter_options' in $$props) $$invalidate(7, filter_options = $$props.filter_options);
    		if ('filter_state' in $$props) $$invalidate(0, filter_state = $$props.filter_state);
    		if ('possible_filter_items' in $$props) $$invalidate(4, possible_filter_items = $$props.possible_filter_items);
    		if ('dropdown_open' in $$props) $$invalidate(3, dropdown_open = $$props.dropdown_open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		filter_state,
    		filter_name,
    		use_icons,
    		dropdown_open,
    		possible_filter_items,
    		toggleFilter,
    		toggleDropdown,
    		filter_options,
    		click_handler
    	];
    }

    class Filter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			filter_name: 1,
    			use_icons: 2,
    			filter_options: 7,
    			filter_state: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Filter",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get filter_name() {
    		throw new Error("<Filter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filter_name(value) {
    		throw new Error("<Filter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get use_icons() {
    		throw new Error("<Filter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use_icons(value) {
    		throw new Error("<Filter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filter_options() {
    		throw new Error("<Filter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filter_options(value) {
    		throw new Error("<Filter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filter_state() {
    		throw new Error("<Filter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filter_state(value) {
    		throw new Error("<Filter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/sections/Projects.svelte generated by Svelte v3.58.0 */
    const file$9 = "src/sections/Projects.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (126:12) <Card>
    function create_default_slot_2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search");
    			attr_dev(input, "class", "filter-input svelte-1pjq42k");
    			add_location(input, file$9, 126, 16, 4007);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filter_text*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[4]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*filter_text*/ 1 && input.value !== /*filter_text*/ ctx[0]) {
    				set_input_value(input, /*filter_text*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(126:12) <Card>",
    		ctx
    	});

    	return block;
    }

    // (147:8) {#each visible_projects as project}
    function create_each_block$2(ctx) {
    	let project;
    	let current;

    	project = new Project({
    			props: {
    				name: /*project*/ ctx[8].name,
    				description: /*project*/ ctx[8].description,
    				category: /*project*/ ctx[8].category,
    				image: /*project*/ ctx[8].image,
    				image_alt: /*project*/ ctx[8].image_alt,
    				techs: /*project*/ ctx[8].techs,
    				links: /*project*/ ctx[8].links
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(project.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(project, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const project_changes = {};
    			if (dirty & /*visible_projects*/ 8) project_changes.name = /*project*/ ctx[8].name;
    			if (dirty & /*visible_projects*/ 8) project_changes.description = /*project*/ ctx[8].description;
    			if (dirty & /*visible_projects*/ 8) project_changes.category = /*project*/ ctx[8].category;
    			if (dirty & /*visible_projects*/ 8) project_changes.image = /*project*/ ctx[8].image;
    			if (dirty & /*visible_projects*/ 8) project_changes.image_alt = /*project*/ ctx[8].image_alt;
    			if (dirty & /*visible_projects*/ 8) project_changes.techs = /*project*/ ctx[8].techs;
    			if (dirty & /*visible_projects*/ 8) project_changes.links = /*project*/ ctx[8].links;
    			project.$set(project_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(project.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(project.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(project, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(147:8) {#each visible_projects as project}",
    		ctx
    	});

    	return block;
    }

    // (124:4) <ContentList>
    function create_default_slot_1$2(ctx) {
    	let div1;
    	let card;
    	let t0;
    	let div0;
    	let filter0;
    	let updating_filter_options;
    	let t1;
    	let filter1;
    	let updating_filter_options_1;
    	let t2;
    	let each_1_anchor;
    	let current;

    	card = new Card({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function filter0_filter_options_binding(value) {
    		/*filter0_filter_options_binding*/ ctx[5](value);
    	}

    	let filter0_props = {
    		filter_name: "Technologies",
    		use_icons: true
    	};

    	if (/*filter_techs*/ ctx[1] !== void 0) {
    		filter0_props.filter_options = /*filter_techs*/ ctx[1];
    	}

    	filter0 = new Filter({ props: filter0_props, $$inline: true });
    	binding_callbacks.push(() => bind(filter0, 'filter_options', filter0_filter_options_binding));

    	function filter1_filter_options_binding(value) {
    		/*filter1_filter_options_binding*/ ctx[6](value);
    	}

    	let filter1_props = { filter_name: "Category" };

    	if (/*filter_categories*/ ctx[2] !== void 0) {
    		filter1_props.filter_options = /*filter_categories*/ ctx[2];
    	}

    	filter1 = new Filter({ props: filter1_props, $$inline: true });
    	binding_callbacks.push(() => bind(filter1, 'filter_options', filter1_filter_options_binding));
    	let each_value = /*visible_projects*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(card.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			create_component(filter0.$$.fragment);
    			t1 = space();
    			create_component(filter1.$$.fragment);
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			attr_dev(div0, "class", "category-filters svelte-1pjq42k");
    			add_location(div0, file$9, 133, 12, 4224);
    			attr_dev(div1, "class", "filter-header svelte-1pjq42k");
    			add_location(div1, file$9, 124, 8, 3944);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(card, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			mount_component(filter0, div0, null);
    			append_dev(div0, t1);
    			mount_component(filter1, div0, null);
    			insert_dev(target, t2, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};

    			if (dirty & /*$$scope, filter_text*/ 2049) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    			const filter0_changes = {};

    			if (!updating_filter_options && dirty & /*filter_techs*/ 2) {
    				updating_filter_options = true;
    				filter0_changes.filter_options = /*filter_techs*/ ctx[1];
    				add_flush_callback(() => updating_filter_options = false);
    			}

    			filter0.$set(filter0_changes);
    			const filter1_changes = {};

    			if (!updating_filter_options_1 && dirty & /*filter_categories*/ 4) {
    				updating_filter_options_1 = true;
    				filter1_changes.filter_options = /*filter_categories*/ ctx[2];
    				add_flush_callback(() => updating_filter_options_1 = false);
    			}

    			filter1.$set(filter1_changes);

    			if (dirty & /*visible_projects*/ 8) {
    				each_value = /*visible_projects*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			transition_in(filter0.$$.fragment, local);
    			transition_in(filter1.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			transition_out(filter0.$$.fragment, local);
    			transition_out(filter1.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(card);
    			destroy_component(filter0);
    			destroy_component(filter1);
    			if (detaching) detach_dev(t2);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(124:4) <ContentList>",
    		ctx
    	});

    	return block;
    }

    // (123:0) <Section title="Projects" id="projects">
    function create_default_slot$6(ctx) {
    	let contentlist;
    	let current;

    	contentlist = new ContentList({
    			props: {
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contentlist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contentlist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const contentlist_changes = {};

    			if (dirty & /*$$scope, visible_projects, filter_categories, filter_techs, filter_text*/ 2063) {
    				contentlist_changes.$$scope = { dirty, ctx };
    			}

    			contentlist.$set(contentlist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contentlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contentlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contentlist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(123:0) <Section title=\\\"Projects\\\" id=\\\"projects\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let section;
    	let current;

    	section = new Section({
    			props: {
    				title: "Projects",
    				id: "projects",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(section, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const section_changes = {};

    			if (dirty & /*$$scope, visible_projects, filter_categories, filter_techs, filter_text*/ 2063) {
    				section_changes.$$scope = { dirty, ctx };
    			}

    			section.$set(section_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function project_is_visible(project, filter_text, filter_techs, filter_categories) {
    	filter_text = filter_text.toLowerCase();
    	filter_techs = filter_techs.map(tech => tech.toLowerCase());
    	filter_categories = filter_categories.map(cat => cat.toLowerCase());
    	let visible = true;

    	if (filter_text && filter_text !== "") {
    		visible = visible && (project.name.toLowerCase().includes(filter_text) || project.description.toLowerCase().includes(filter_text));
    	}

    	if (filter_techs.length > 0) {
    		visible = visible && filter_techs.some(tech => project.techs.some(project_tech => project_tech.toLowerCase().includes(tech)));
    	}

    	if (filter_categories.length > 0) {
    		visible = visible && filter_categories.some(cat => project.category.toLowerCase().includes(cat));
    	}

    	return visible;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let visible_projects;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Projects', slots, []);
    	let filter_text = "";
    	let filter_techs = ["Python", "Rust", "PyTorch"];
    	let filter_categories = ["Machine learning", "Data collection", "Game theory"];

    	let projects = [
    		{
    			name: "Open Lyrics Dataset",
    			description: "A dataset of song lyrics",
    			category: "Data collection",
    			image: "images/lyrics.jpg",
    			image_alt: "lyrics on sheet music",
    			techs: ["Python"],
    			links: [{ name: "GitHub", url: "" }]
    		},
    		{
    			name: "Generating structured latent spaces with VAEs",
    			description: "Implementation of a novel method for deep archetypal analysis, with the aim of creating highly interpretable latent spaces.",
    			category: "Machine learning",
    			image: "images/nebula.webp",
    			image_alt: "a nebula",
    			techs: ["Python", "PyTorch"],
    			links: [{ name: "GitHub", url: "" }, { name: "Paper", url: "" }]
    		},
    		{
    			name: "Calculating optimal bets in CamelUp",
    			description: "Ever played this obscure yet fun board game, and felt a burning desire to win at all costs? Well, you're in luck! I spent far too many hours of my life creating the stockcamel engine in high performance, multi-threaded rust.",
    			category: "Game theory",
    			image: "images/dice.jpg",
    			image_alt: "Black and white dice",
    			techs: ["Rust"],
    			links: [{ name: "GitHub", url: "" }, { name: "Link", url: "" }]
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Projects> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		filter_text = this.value;
    		$$invalidate(0, filter_text);
    	}

    	function filter0_filter_options_binding(value) {
    		filter_techs = value;
    		$$invalidate(1, filter_techs);
    	}

    	function filter1_filter_options_binding(value) {
    		filter_categories = value;
    		$$invalidate(2, filter_categories);
    	}

    	$$self.$capture_state = () => ({
    		Section,
    		ContentList,
    		Project,
    		Filter,
    		Card,
    		filter_text,
    		filter_techs,
    		filter_categories,
    		project_is_visible,
    		projects,
    		visible_projects
    	});

    	$$self.$inject_state = $$props => {
    		if ('filter_text' in $$props) $$invalidate(0, filter_text = $$props.filter_text);
    		if ('filter_techs' in $$props) $$invalidate(1, filter_techs = $$props.filter_techs);
    		if ('filter_categories' in $$props) $$invalidate(2, filter_categories = $$props.filter_categories);
    		if ('projects' in $$props) $$invalidate(7, projects = $$props.projects);
    		if ('visible_projects' in $$props) $$invalidate(3, visible_projects = $$props.visible_projects);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*filter_text, filter_techs, filter_categories*/ 7) {
    			$$invalidate(3, visible_projects = projects.filter(project => project_is_visible(project, filter_text, filter_techs, filter_categories)));
    		}
    	};

    	return [
    		filter_text,
    		filter_techs,
    		filter_categories,
    		visible_projects,
    		input_input_handler,
    		filter0_filter_options_binding,
    		filter1_filter_options_binding
    	];
    }

    class Projects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Projects",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/sections/About.svelte generated by Svelte v3.58.0 */
    const file$8 = "src/sections/About.svelte";

    // (11:4) <Card>
    function create_default_slot_1$1(ctx) {
    	let div2;
    	let div0;
    	let h1;
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let ul;
    	let li0;
    	let icon0;
    	let t4;
    	let li1;
    	let icon1;
    	let t5;
    	let div1;
    	let icon2;
    	let current;

    	icon0 = new Icon({
    			props: { name: "github", size: "2em" },
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: {
    				name: "linkedin",
    				size: "2em",
    				use_color: false
    			},
    			$$inline: true
    		});

    	icon2 = new Icon({
    			props: { name: "logo", size: "15em" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text(/*name*/ ctx[0]);
    			t1 = space();
    			p = element("p");
    			t2 = text(/*about_text*/ ctx[1]);
    			t3 = space();
    			ul = element("ul");
    			li0 = element("li");
    			create_component(icon0.$$.fragment);
    			t4 = space();
    			li1 = element("li");
    			create_component(icon1.$$.fragment);
    			t5 = space();
    			div1 = element("div");
    			create_component(icon2.$$.fragment);
    			attr_dev(h1, "class", "section-title");
    			attr_dev(h1, "tabindex", "-1");
    			add_location(h1, file$8, 13, 16, 371);
    			add_location(p, file$8, 14, 16, 439);
    			attr_dev(li0, "class", "svelte-1vofd2m");
    			add_location(li0, file$8, 16, 20, 500);
    			attr_dev(li1, "class", "svelte-1vofd2m");
    			add_location(li1, file$8, 19, 20, 609);
    			attr_dev(ul, "class", "svelte-1vofd2m");
    			add_location(ul, file$8, 15, 16, 475);
    			attr_dev(div0, "class", "content");
    			add_location(div0, file$8, 12, 12, 333);
    			attr_dev(div1, "class", "headshot svelte-1vofd2m");
    			add_location(div1, file$8, 24, 12, 771);
    			attr_dev(div2, "class", "about-card svelte-1vofd2m");
    			add_location(div2, file$8, 11, 8, 296);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(p, t2);
    			append_dev(div0, t3);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			mount_component(icon0, li0, null);
    			append_dev(ul, t4);
    			append_dev(ul, li1);
    			mount_component(icon1, li1, null);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			mount_component(icon2, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*name*/ 1) set_data_dev(t0, /*name*/ ctx[0]);
    			if (!current || dirty & /*about_text*/ 2) set_data_dev(t2, /*about_text*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(icon2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(icon2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(icon0);
    			destroy_component(icon1);
    			destroy_component(icon2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(11:4) <Card>",
    		ctx
    	});

    	return block;
    }

    // (10:0) <Section id="about">
    function create_default_slot$5(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};

    			if (dirty & /*$$scope, about_text, name*/ 7) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(10:0) <Section id=\\\"about\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let section;
    	let current;

    	section = new Section({
    			props: {
    				id: "about",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(section, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const section_changes = {};

    			if (dirty & /*$$scope, about_text, name*/ 7) {
    				section_changes.$$scope = { dirty, ctx };
    			}

    			section.$set(section_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	let { name = "Tanner Sims" } = $$props;
    	let { about_text = "About text" } = $$props;
    	const writable_props = ['name', 'about_text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('about_text' in $$props) $$invalidate(1, about_text = $$props.about_text);
    	};

    	$$self.$capture_state = () => ({ Icon, Card, Section, name, about_text });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('about_text' in $$props) $$invalidate(1, about_text = $$props.about_text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, about_text];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { name: 0, about_text: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get name() {
    		throw new Error("<About>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<About>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get about_text() {
    		throw new Error("<About>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set about_text(value) {
    		throw new Error("<About>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/ExperienceCard.svelte generated by Svelte v3.58.0 */
    const file$7 = "src/components/ExperienceCard.svelte";

    // (12:4) <Card>
    function create_default_slot$4(ctx) {
    	let div2;
    	let div0;
    	let h3;
    	let t0;
    	let t1;
    	let h4;
    	let t2_value = /*position*/ ctx[1].toUpperCase() + "";
    	let t2;
    	let t3;
    	let summary;
    	let p;
    	let t4;
    	let t5;
    	let footer;
    	let a;
    	let t6;
    	let t7;
    	let t8;
    	let div1;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			t0 = text(/*company*/ ctx[0]);
    			t1 = space();
    			h4 = element("h4");
    			t2 = text(t2_value);
    			t3 = space();
    			summary = element("summary");
    			p = element("p");
    			t4 = text(/*description*/ ctx[3]);
    			t5 = space();
    			footer = element("footer");
    			a = element("a");
    			t6 = text(/*company*/ ctx[0]);
    			t7 = text(" Website >");
    			t8 = space();
    			div1 = element("div");
    			attr_dev(h3, "class", "svelte-1kxy1zk");
    			add_location(h3, file$7, 14, 16, 392);
    			attr_dev(h4, "class", "svelte-1kxy1zk");
    			add_location(h4, file$7, 15, 16, 427);
    			attr_dev(p, "class", "svelte-1kxy1zk");
    			add_location(p, file$7, 16, 25, 486);
    			attr_dev(summary, "class", "svelte-1kxy1zk");
    			add_location(summary, file$7, 16, 16, 477);
    			attr_dev(a, "href", /*link*/ ctx[4]);
    			attr_dev(a, "class", "svelte-1kxy1zk");
    			add_location(a, file$7, 18, 20, 562);
    			attr_dev(footer, "class", "svelte-1kxy1zk");
    			add_location(footer, file$7, 17, 16, 533);
    			attr_dev(div0, "class", "info svelte-1kxy1zk");
    			add_location(div0, file$7, 13, 12, 357);
    			attr_dev(div1, "class", "style_box svelte-1kxy1zk");
    			add_location(div1, file$7, 21, 12, 658);
    			attr_dev(div2, "class", "card svelte-1kxy1zk");
    			add_location(div2, file$7, 12, 8, 326);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, h3);
    			append_dev(h3, t0);
    			append_dev(div0, t1);
    			append_dev(div0, h4);
    			append_dev(h4, t2);
    			append_dev(div0, t3);
    			append_dev(div0, summary);
    			append_dev(summary, p);
    			append_dev(p, t4);
    			append_dev(div0, t5);
    			append_dev(div0, footer);
    			append_dev(footer, a);
    			append_dev(a, t6);
    			append_dev(a, t7);
    			append_dev(div2, t8);
    			append_dev(div2, div1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*company*/ 1) set_data_dev(t0, /*company*/ ctx[0]);
    			if (dirty & /*position*/ 2 && t2_value !== (t2_value = /*position*/ ctx[1].toUpperCase() + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*description*/ 8) set_data_dev(t4, /*description*/ ctx[3]);
    			if (dirty & /*company*/ 1) set_data_dev(t6, /*company*/ ctx[0]);

    			if (dirty & /*link*/ 16) {
    				attr_dev(a, "href", /*link*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(12:4) <Card>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let article;
    	let card;
    	let t0;
    	let div;
    	let p;
    	let t1;
    	let current;

    	card = new Card({
    			props: {
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article = element("article");
    			create_component(card.$$.fragment);
    			t0 = space();
    			div = element("div");
    			p = element("p");
    			t1 = text(/*duration*/ ctx[2]);
    			attr_dev(p, "class", "svelte-1kxy1zk");
    			add_location(p, file$7, 25, 8, 746);
    			attr_dev(div, "class", "duration svelte-1kxy1zk");
    			add_location(div, file$7, 24, 4, 715);
    			attr_dev(article, "class", "svelte-1kxy1zk");
    			add_location(article, file$7, 10, 0, 297);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			mount_component(card, article, null);
    			append_dev(article, t0);
    			append_dev(article, div);
    			append_dev(div, p);
    			append_dev(p, t1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card_changes = {};

    			if (dirty & /*$$scope, link, company, description, position*/ 59) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    			if (!current || dirty & /*duration*/ 4) set_data_dev(t1, /*duration*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_component(card);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ExperienceCard', slots, []);
    	let { company = "Company Name" } = $$props;
    	let { position = "Position" } = $$props;
    	let { duration = "Jan 1900 - Present" } = $$props;
    	let { description = "One of the jobs of all jobs." } = $$props;
    	let { link = "https://www.example.com/" } = $$props;
    	const writable_props = ['company', 'position', 'duration', 'description', 'link'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ExperienceCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('company' in $$props) $$invalidate(0, company = $$props.company);
    		if ('position' in $$props) $$invalidate(1, position = $$props.position);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('description' in $$props) $$invalidate(3, description = $$props.description);
    		if ('link' in $$props) $$invalidate(4, link = $$props.link);
    	};

    	$$self.$capture_state = () => ({
    		Card,
    		company,
    		position,
    		duration,
    		description,
    		link
    	});

    	$$self.$inject_state = $$props => {
    		if ('company' in $$props) $$invalidate(0, company = $$props.company);
    		if ('position' in $$props) $$invalidate(1, position = $$props.position);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('description' in $$props) $$invalidate(3, description = $$props.description);
    		if ('link' in $$props) $$invalidate(4, link = $$props.link);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [company, position, duration, description, link];
    }

    class ExperienceCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			company: 0,
    			position: 1,
    			duration: 2,
    			description: 3,
    			link: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExperienceCard",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get company() {
    		throw new Error("<ExperienceCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set company(value) {
    		throw new Error("<ExperienceCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<ExperienceCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<ExperienceCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<ExperienceCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<ExperienceCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<ExperienceCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<ExperienceCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get link() {
    		throw new Error("<ExperienceCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<ExperienceCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/sections/Experience.svelte generated by Svelte v3.58.0 */

    // (8:4) <ContentList>
    function create_default_slot_1(ctx) {
    	let experiencecard0;
    	let t0;
    	let experiencecard1;
    	let t1;
    	let experiencecard2;
    	let t2;
    	let experiencecard3;
    	let current;

    	experiencecard0 = new ExperienceCard({
    			props: {
    				company: "Opsis Health",
    				position: "Machine Learning Consultant",
    				duration: "Jan 2022 - Present",
    				description: "Use python and pytorch to build, train and test various point cloud volume estimation models for upcoming Opsis health product. Implement and optimize new point cloud network methods based on recent white papers. Coordinate with deployment team to develop model pipeline and retraining strategies.",
    				link: "https://www.opsishealth.com/"
    			},
    			$$inline: true
    		});

    	experiencecard1 = new ExperienceCard({
    			props: {
    				company: "Branch",
    				position: "Machine Learning Specialist",
    				duration: "Aug 2021 - Apr 2022",
    				description: "Did some stuff ¯\\_(ツ)_/¯",
    				link: "https://github.com/with-branch"
    			},
    			$$inline: true
    		});

    	experiencecard2 = new ExperienceCard({
    			props: {
    				company: "Branch",
    				position: "Technical Lead",
    				duration: "Apr 2022 - Jan 2023",
    				description: "Did some stuff ¯\\_(ツ)_/¯",
    				link: "https://github.com/with-branch"
    			},
    			$$inline: true
    		});

    	experiencecard3 = new ExperienceCard({
    			props: {
    				company: "University of Utah",
    				position: "Research Assistant",
    				duration: "Jan 2021 - Present",
    				description: "Worky worky",
    				link: "https://www.math.utah.edu/"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(experiencecard0.$$.fragment);
    			t0 = space();
    			create_component(experiencecard1.$$.fragment);
    			t1 = space();
    			create_component(experiencecard2.$$.fragment);
    			t2 = space();
    			create_component(experiencecard3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(experiencecard0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(experiencecard1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(experiencecard2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(experiencecard3, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(experiencecard0.$$.fragment, local);
    			transition_in(experiencecard1.$$.fragment, local);
    			transition_in(experiencecard2.$$.fragment, local);
    			transition_in(experiencecard3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(experiencecard0.$$.fragment, local);
    			transition_out(experiencecard1.$$.fragment, local);
    			transition_out(experiencecard2.$$.fragment, local);
    			transition_out(experiencecard3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(experiencecard0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(experiencecard1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(experiencecard2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(experiencecard3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(8:4) <ContentList>",
    		ctx
    	});

    	return block;
    }

    // (7:0) <Section title="Experience" id="experience">
    function create_default_slot$3(ctx) {
    	let contentlist;
    	let current;

    	contentlist = new ContentList({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contentlist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contentlist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const contentlist_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				contentlist_changes.$$scope = { dirty, ctx };
    			}

    			contentlist.$set(contentlist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contentlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contentlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contentlist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(7:0) <Section title=\\\"Experience\\\" id=\\\"experience\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let section;
    	let current;

    	section = new Section({
    			props: {
    				title: "Experience",
    				id: "experience",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(section, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const section_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				section_changes.$$scope = { dirty, ctx };
    			}

    			section.$set(section_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Experience', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Experience> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Section, ContentList, ExperienceCard });
    	return [];
    }

    class Experience extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Experience",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/components/DownloadCard.svelte generated by Svelte v3.58.0 */
    const file$6 = "src/components/DownloadCard.svelte";

    // (12:4) <Card hover={true}>
    function create_default_slot$2(ctx) {
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div3;
    	let div1;
    	let h3;
    	let t1;
    	let t2;
    	let p;
    	let t3;
    	let t4;
    	let div2;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { name: "download", size: "2em" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div3 = element("div");
    			div1 = element("div");
    			h3 = element("h3");
    			t1 = text(/*name*/ ctx[0]);
    			t2 = space();
    			p = element("p");
    			t3 = text(/*file_size*/ ctx[1]);
    			t4 = space();
    			div2 = element("div");
    			create_component(icon.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = /*preview_image*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Resume");
    			add_location(img, file$6, 13, 12, 351);
    			attr_dev(div0, "class", "image svelte-15o5a3p");
    			add_location(div0, file$6, 12, 8, 319);
    			attr_dev(h3, "class", "svelte-15o5a3p");
    			add_location(h3, file$6, 17, 16, 492);
    			attr_dev(p, "class", "svelte-15o5a3p");
    			add_location(p, file$6, 18, 16, 524);
    			attr_dev(div1, "class", "title-block svelte-15o5a3p");
    			add_location(div1, file$6, 16, 12, 450);
    			attr_dev(div2, "class", "download-icon svelte-15o5a3p");
    			add_location(div2, file$6, 20, 12, 574);
    			attr_dev(div3, "class", "info-bar svelte-15o5a3p");
    			add_location(div3, file$6, 15, 8, 415);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, img);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, h3);
    			append_dev(h3, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    			append_dev(p, t3);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			mount_component(icon, div2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*preview_image*/ 8 && !src_url_equal(img.src, img_src_value = /*preview_image*/ ctx[3])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*name*/ 1) set_data_dev(t1, /*name*/ ctx[0]);
    			if (!current || dirty & /*file_size*/ 2) set_data_dev(t3, /*file_size*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div3);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(12:4) <Card hover={true}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let a;
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				hover: true,
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			a = element("a");
    			create_component(card.$$.fragment);
    			attr_dev(a, "href", /*download_url*/ ctx[2]);
    			attr_dev(a, "class", "svelte-15o5a3p");
    			add_location(a, file$6, 10, 0, 263);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			mount_component(card, a, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card_changes = {};

    			if (dirty & /*$$scope, file_size, name, preview_image*/ 27) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);

    			if (!current || dirty & /*download_url*/ 4) {
    				attr_dev(a, "href", /*download_url*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			destroy_component(card);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DownloadCard', slots, []);
    	let { name = "Download Name" } = $$props;
    	let { file_size = "0kb" } = $$props;
    	let { download_url = "" } = $$props;
    	let { preview_image = "" } = $$props;
    	const writable_props = ['name', 'file_size', 'download_url', 'preview_image'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DownloadCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('file_size' in $$props) $$invalidate(1, file_size = $$props.file_size);
    		if ('download_url' in $$props) $$invalidate(2, download_url = $$props.download_url);
    		if ('preview_image' in $$props) $$invalidate(3, preview_image = $$props.preview_image);
    	};

    	$$self.$capture_state = () => ({
    		Card,
    		Icon,
    		name,
    		file_size,
    		download_url,
    		preview_image
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('file_size' in $$props) $$invalidate(1, file_size = $$props.file_size);
    		if ('download_url' in $$props) $$invalidate(2, download_url = $$props.download_url);
    		if ('preview_image' in $$props) $$invalidate(3, preview_image = $$props.preview_image);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, file_size, download_url, preview_image];
    }

    class DownloadCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			name: 0,
    			file_size: 1,
    			download_url: 2,
    			preview_image: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DownloadCard",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get name() {
    		throw new Error("<DownloadCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<DownloadCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get file_size() {
    		throw new Error("<DownloadCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set file_size(value) {
    		throw new Error("<DownloadCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get download_url() {
    		throw new Error("<DownloadCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set download_url(value) {
    		throw new Error("<DownloadCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get preview_image() {
    		throw new Error("<DownloadCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set preview_image(value) {
    		throw new Error("<DownloadCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/sections/Downloads.svelte generated by Svelte v3.58.0 */
    const file$5 = "src/sections/Downloads.svelte";

    // (6:0) <Section title="Downloads" id="downloads">
    function create_default_slot$1(ctx) {
    	let ul;
    	let li0;
    	let downloadcard0;
    	let t;
    	let li1;
    	let downloadcard1;
    	let current;

    	downloadcard0 = new DownloadCard({
    			props: {
    				name: "Resume",
    				file_size: "123kb",
    				download_url: "downloads/resume.pdf",
    				preview_image: "images/resume.webp"
    			},
    			$$inline: true
    		});

    	downloadcard1 = new DownloadCard({
    			props: {
    				name: "CV",
    				file_size: "123kb",
    				download_url: "downloads/cv.pdf",
    				preview_image: "images/cv.webp"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			li0 = element("li");
    			create_component(downloadcard0.$$.fragment);
    			t = space();
    			li1 = element("li");
    			create_component(downloadcard1.$$.fragment);
    			attr_dev(li0, "class", "svelte-iz7ccr");
    			add_location(li0, file$5, 7, 8, 202);
    			attr_dev(li1, "class", "svelte-iz7ccr");
    			add_location(li1, file$5, 15, 8, 437);
    			attr_dev(ul, "class", "svelte-iz7ccr");
    			add_location(ul, file$5, 6, 4, 189);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			mount_component(downloadcard0, li0, null);
    			append_dev(ul, t);
    			append_dev(ul, li1);
    			mount_component(downloadcard1, li1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(downloadcard0.$$.fragment, local);
    			transition_in(downloadcard1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(downloadcard0.$$.fragment, local);
    			transition_out(downloadcard1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_component(downloadcard0);
    			destroy_component(downloadcard1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(6:0) <Section title=\\\"Downloads\\\" id=\\\"downloads\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let section;
    	let current;

    	section = new Section({
    			props: {
    				title: "Downloads",
    				id: "downloads",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(section, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const section_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				section_changes.$$scope = { dirty, ctx };
    			}

    			section.$set(section_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Downloads', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Downloads> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Section, DownloadCard });
    	return [];
    }

    class Downloads extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Downloads",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/ContentColumn.svelte generated by Svelte v3.58.0 */

    const file$4 = "src/components/ContentColumn.svelte";

    function create_fragment$4(ctx) {
    	let main;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (default_slot) default_slot.c();
    			attr_dev(main, "class", "svelte-8mwsye");
    			add_location(main, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			if (default_slot) {
    				default_slot.m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ContentColumn', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ContentColumn> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class ContentColumn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContentColumn",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/sections/Contact.svelte generated by Svelte v3.58.0 */
    const file$3 = "src/sections/Contact.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (27:8) {#each contacts as contact}
    function create_each_block$1(ctx) {
    	let a;
    	let div;
    	let icon;
    	let t0;
    	let p;
    	let t1_value = /*contact*/ ctx[1].text + "";
    	let t1;
    	let t2;
    	let a_href_value;
    	let current;

    	icon = new Icon({
    			props: {
    				name: /*contact*/ ctx[1].name,
    				size: "2em"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			a = element("a");
    			div = element("div");
    			create_component(icon.$$.fragment);
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(div, "class", "icon svelte-1j0bmks");
    			add_location(div, file$3, 28, 16, 753);
    			attr_dev(p, "class", "svelte-1j0bmks");
    			add_location(p, file$3, 31, 16, 871);
    			attr_dev(a, "href", a_href_value = /*contact*/ ctx[1].link);
    			attr_dev(a, "class", "svelte-1j0bmks");
    			add_location(a, file$3, 27, 12, 713);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div);
    			mount_component(icon, div, null);
    			append_dev(a, t0);
    			append_dev(a, p);
    			append_dev(p, t1);
    			append_dev(a, t2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty & /*contacts*/ 1) icon_changes.name = /*contact*/ ctx[1].name;
    			icon.$set(icon_changes);
    			if ((!current || dirty & /*contacts*/ 1) && t1_value !== (t1_value = /*contact*/ ctx[1].text + "")) set_data_dev(t1, t1_value);

    			if (!current || dirty & /*contacts*/ 1 && a_href_value !== (a_href_value = /*contact*/ ctx[1].link)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(27:8) {#each contacts as contact}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let footer;
    	let h2;
    	let t1;
    	let div;
    	let current;
    	let each_value = /*contacts*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			h2 = element("h2");
    			h2.textContent = "Contact";
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "section-title svelte-1j0bmks");
    			attr_dev(h2, "tabindex", "-1");
    			add_location(h2, file$3, 24, 4, 586);
    			attr_dev(div, "class", "contact svelte-1j0bmks");
    			add_location(div, file$3, 25, 4, 643);
    			attr_dev(footer, "id", "contact");
    			attr_dev(footer, "class", "svelte-1j0bmks");
    			add_location(footer, file$3, 23, 0, 560);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, h2);
    			append_dev(footer, t1);
    			append_dev(footer, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*contacts*/ 1) {
    				each_value = /*contacts*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);

    	let { contacts = [
    		{
    			name: "Email",
    			text: "none@gmail.com",
    			link: "mailto:none@gmail.com"
    		},
    		{
    			name: "GitHub",
    			text: "/none",
    			link: "https://www.github.com/none/"
    		},
    		{
    			name: "LinkedIn",
    			text: "/none",
    			link: "https://www.linkedin.com/in/none/"
    		}
    	] } = $$props;

    	const writable_props = ['contacts'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('contacts' in $$props) $$invalidate(0, contacts = $$props.contacts);
    	};

    	$$self.$capture_state = () => ({ Icon, ContentColumn, contacts });

    	$$self.$inject_state = $$props => {
    		if ('contacts' in $$props) $$invalidate(0, contacts = $$props.contacts);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [contacts];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { contacts: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get contacts() {
    		throw new Error("<Contact>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contacts(value) {
    		throw new Error("<Contact>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/ThemeToggle.svelte generated by Svelte v3.58.0 */
    const file$2 = "src/components/ThemeToggle.svelte";

    function create_fragment$2(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: { name: /*theme*/ ctx[0], size: "1.15em" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div0, "class", "toggle-notch svelte-1r99oew");
    			add_location(div0, file$2, 16, 8, 374);
    			attr_dev(div1, "class", "toggle-nob svelte-1r99oew");
    			set_style(div1, "left", /*toggle_left*/ ctx[1] ? '0.5em' : '2em');
    			add_location(div1, file$2, 17, 8, 411);
    			attr_dev(div2, "class", "toggle-button svelte-1r99oew");
    			add_location(div2, file$2, 15, 4, 314);
    			attr_dev(div3, "class", "toggle-container svelte-1r99oew");
    			attr_dev(div3, "aria-hidden", "true");
    			add_location(div3, file$2, 14, 0, 260);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			mount_component(icon, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", /*toggle_theme*/ ctx[2], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const icon_changes = {};
    			if (dirty & /*theme*/ 1) icon_changes.name = /*theme*/ ctx[0];
    			icon.$set(icon_changes);

    			if (!current || dirty & /*toggle_left*/ 2) {
    				set_style(div1, "left", /*toggle_left*/ ctx[1] ? '0.5em' : '2em');
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ThemeToggle', slots, []);
    	let { theme_function } = $$props;
    	let { theme = "dark" } = $$props;
    	let toggle_left = true;

    	function toggle_theme() {
    		$$invalidate(1, toggle_left = !toggle_left);
    		theme_function(toggle_left);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (theme_function === undefined && !('theme_function' in $$props || $$self.$$.bound[$$self.$$.props['theme_function']])) {
    			console.warn("<ThemeToggle> was created without expected prop 'theme_function'");
    		}
    	});

    	const writable_props = ['theme_function', 'theme'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ThemeToggle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('theme_function' in $$props) $$invalidate(3, theme_function = $$props.theme_function);
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    	};

    	$$self.$capture_state = () => ({
    		Icon,
    		theme_function,
    		theme,
    		toggle_left,
    		toggle_theme
    	});

    	$$self.$inject_state = $$props => {
    		if ('theme_function' in $$props) $$invalidate(3, theme_function = $$props.theme_function);
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('toggle_left' in $$props) $$invalidate(1, toggle_left = $$props.toggle_left);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [theme, toggle_left, toggle_theme, theme_function];
    }

    class ThemeToggle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { theme_function: 3, theme: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ThemeToggle",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get theme_function() {
    		throw new Error("<ThemeToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme_function(value) {
    		throw new Error("<ThemeToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get theme() {
    		throw new Error("<ThemeToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<ThemeToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/sections/Navigation.svelte generated by Svelte v3.58.0 */

    const { console: console_1 } = globals;
    const file$1 = "src/sections/Navigation.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (64:16) {#each nav_links as link}
    function create_each_block(ctx) {
    	let li;
    	let a;
    	let t0_value = /*link*/ ctx[4].name + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[4].link);
    			set_style(a, "line-height", /*height*/ ctx[1]);
    			attr_dev(a, "class", "" + (null_to_empty("") + " svelte-fzd2yf"));
    			add_location(a, file$1, 65, 24, 1863);
    			attr_dev(li, "class", "svelte-fzd2yf");
    			add_location(li, file$1, 64, 20, 1834);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", handleNavigationClick, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*nav_links*/ 1 && t0_value !== (t0_value = /*link*/ ctx[4].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*nav_links*/ 1 && a_href_value !== (a_href_value = /*link*/ ctx[4].link)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*height*/ 2) {
    				set_style(a, "line-height", /*height*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(64:16) {#each nav_links as link}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div0;
    	let t0;
    	let nav;
    	let div2;
    	let a;
    	let icon;
    	let t1;
    	let div1;
    	let ul;
    	let t2;
    	let themetoggle;
    	let current;

    	icon = new Icon({
    			props: { name: "logo", size: "3em" },
    			$$inline: true
    		});

    	let each_value = /*nav_links*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	themetoggle = new ThemeToggle({
    			props: {
    				theme_function: /*theme_function*/ ctx[2],
    				theme: /*theme*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			nav = element("nav");
    			div2 = element("div");
    			a = element("a");
    			create_component(icon.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			create_component(themetoggle.$$.fragment);
    			attr_dev(div0, "class", "banner-spacer");
    			set_style(div0, "height", /*height*/ ctx[1]);
    			set_style(div0, "margin", "1.5em");
    			add_location(div0, file$1, 55, 0, 1485);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "logo svelte-fzd2yf");
    			attr_dev(a, "aria-hidden", "true");
    			add_location(a, file$1, 58, 8, 1610);
    			attr_dev(ul, "role", "menu");
    			attr_dev(ul, "class", "svelte-fzd2yf");
    			add_location(ul, file$1, 62, 12, 1755);
    			attr_dev(div1, "class", "nav-left svelte-fzd2yf");
    			add_location(div1, file$1, 61, 8, 1720);
    			attr_dev(div2, "class", "nav-container svelte-fzd2yf");
    			add_location(div2, file$1, 57, 4, 1574);
    			attr_dev(nav, "id", "banner");
    			attr_dev(nav, "class", "svelte-fzd2yf");
    			add_location(nav, file$1, 56, 0, 1552);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div2);
    			append_dev(div2, a);
    			mount_component(icon, a, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			append_dev(div1, t2);
    			mount_component(themetoggle, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*height*/ 2) {
    				set_style(div0, "height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*nav_links, height, handleNavigationClick*/ 3) {
    				each_value = /*nav_links*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const themetoggle_changes = {};
    			if (dirty & /*theme_function*/ 4) themetoggle_changes.theme_function = /*theme_function*/ ctx[2];
    			if (dirty & /*theme*/ 8) themetoggle_changes.theme = /*theme*/ ctx[3];
    			themetoggle.$set(themetoggle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(themetoggle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(themetoggle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(nav);
    			destroy_component(icon);
    			destroy_each(each_blocks, detaching);
    			destroy_component(themetoggle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function navigateToSection(section_id) {
    	const scrollTarget = document.getElementById(section_id);
    	const scrollTargetLocation = scrollTarget.offsetTop;
    	const navigationElementHeight = document.getElementById("banner").offsetHeight;

    	window.scrollTo({
    		top: scrollTargetLocation - navigationElementHeight,
    		left: 0,
    		behavior: "smooth"
    	});

    	const sectionHeading = scrollTarget.getElementsByClassName("section-title")[0];
    	sectionHeading.focus({ preventScroll: true });
    }

    function handleNavigationClick(event) {
    	event.preventDefault();
    	const target = event.target;
    	const href = target.getAttribute("href");
    	console.log(href);
    	navigateToSection(href);
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navigation', slots, []);

    	let { nav_links = [
    		{ name: "About", link: "about" },
    		{ name: "Projects", link: "projects" },
    		{ name: "Experience", link: "experience" },
    		{ name: "Resume", link: "downloads" },
    		{ name: "Contact", link: "contact" }
    	] } = $$props;

    	let { height = "5em" } = $$props;
    	let { theme_function } = $$props;
    	let { theme = "dark" } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (theme_function === undefined && !('theme_function' in $$props || $$self.$$.bound[$$self.$$.props['theme_function']])) {
    			console_1.warn("<Navigation> was created without expected prop 'theme_function'");
    		}
    	});

    	const writable_props = ['nav_links', 'height', 'theme_function', 'theme'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Navigation> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('nav_links' in $$props) $$invalidate(0, nav_links = $$props.nav_links);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('theme_function' in $$props) $$invalidate(2, theme_function = $$props.theme_function);
    		if ('theme' in $$props) $$invalidate(3, theme = $$props.theme);
    	};

    	$$self.$capture_state = () => ({
    		Icon,
    		ThemeToggle,
    		nav_links,
    		height,
    		theme_function,
    		theme,
    		navigateToSection,
    		handleNavigationClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('nav_links' in $$props) $$invalidate(0, nav_links = $$props.nav_links);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('theme_function' in $$props) $$invalidate(2, theme_function = $$props.theme_function);
    		if ('theme' in $$props) $$invalidate(3, theme = $$props.theme);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [nav_links, height, theme_function, theme];
    }

    class Navigation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			nav_links: 0,
    			height: 1,
    			theme_function: 2,
    			theme: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navigation",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get nav_links() {
    		throw new Error("<Navigation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nav_links(value) {
    		throw new Error("<Navigation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Navigation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Navigation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get theme_function() {
    		throw new Error("<Navigation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme_function(value) {
    		throw new Error("<Navigation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get theme() {
    		throw new Error("<Navigation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<Navigation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const themes = {
        light: {
            name: "light",
            colors: {
                background: '#FEFEFE',
                section: "#F2F1F0",
                label: {
                    background: "#E6E5E5",
                    border: "#CDCECF",
                    text: "#697276"
                },
                card: {
                    background: "#fff",
                    accent: "#CDCECF",
                    highlight: "#9BA0A2",
                    dark: "#9BA0A2",
                    footer: "#9BA0A2"
                },
                contact: {
                    header: "#697276",
                    body: "#9BA0A2"
                },
                hero: {
                    background: "#fff",
                    highlight: "#F2F1F0",
                    border: "#CDCECF"
                },
                text: {
                    header: "#1D1E20",
                    body: "2A3135",
                    ondark: "#fff"
                }
            }
        },
        dark: {
            name: "dark",
            colors: {
                background: '#1D1E20',
                section: "#24282B",
                label: {
                    background: "#697276",
                    border: "#9BA0A2",
                    text: "#CDCECF"
                },
                card: {
                    background: "#313539",
                    accent: "#697276",
                    highlight: "#9BA0A2",
                    dark: "#313539",
                    footer: "#697276"
                },
                contact: {
                    header: "#313539",
                    body: "#24282B"
                },
                hero: {
                    background: "#24282B",
                    highlight: "#313539",
                    border: "#697276"
                },
                text: {
                    header: "#fff",
                    body: "#E6E5E5",
                    ondark: "#E6E5E5"
                },
            }
        }
    };

    const style = {
        transition: {
            theme: "0.2s ease",
        },
        border: {
            width: "1px",
        }
    };

    /* src/App.svelte generated by Svelte v3.58.0 */

    const { Object: Object_1 } = globals;
    const file = "src/App.svelte";

    // (55:0) <ContentColumn>
    function create_default_slot(ctx) {
    	let about;
    	let t0;
    	let projects;
    	let t1;
    	let experience;
    	let t2;
    	let downloads;
    	let t3;
    	let contact;
    	let current;

    	about = new About({
    			props: {
    				name: "Tanner Sims",
    				about_text: "Hi, I'm Tanner. I'm a software engineer and data scientist."
    			},
    			$$inline: true
    		});

    	projects = new Projects({ $$inline: true });
    	experience = new Experience({ $$inline: true });
    	downloads = new Downloads({ $$inline: true });
    	contact = new Contact({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(about.$$.fragment);
    			t0 = space();
    			create_component(projects.$$.fragment);
    			t1 = space();
    			create_component(experience.$$.fragment);
    			t2 = space();
    			create_component(downloads.$$.fragment);
    			t3 = space();
    			create_component(contact.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(about, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(projects, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(experience, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(downloads, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(contact, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(about.$$.fragment, local);
    			transition_in(projects.$$.fragment, local);
    			transition_in(experience.$$.fragment, local);
    			transition_in(downloads.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(about.$$.fragment, local);
    			transition_out(projects.$$.fragment, local);
    			transition_out(experience.$$.fragment, local);
    			transition_out(downloads.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(about, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(projects, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(experience, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(downloads, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(contact, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(55:0) <ContentColumn>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let head;
    	let link0;
    	let t0;
    	let link1;
    	let t1;
    	let navigation;
    	let t2;
    	let contentcolumn;
    	let current;

    	navigation = new Navigation({
    			props: {
    				theme_function: /*toggleTheme*/ ctx[1],
    				theme: /*theme*/ ctx[0].name
    			},
    			$$inline: true
    		});

    	contentcolumn = new ContentColumn({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			head = element("head");
    			link0 = element("link");
    			t0 = space();
    			link1 = element("link");
    			t1 = space();
    			create_component(navigation.$$.fragment);
    			t2 = space();
    			create_component(contentcolumn.$$.fragment);
    			attr_dev(link0, "href", "https://fonts.googleapis.com/css?family=Work+Sans:400,600,700&display=swap");
    			attr_dev(link0, "rel", "stylesheet");
    			add_location(link0, file, 43, 1, 1252);
    			attr_dev(link1, "href", "https://fonts.googleapis.com/css?family=IBM+Plex+Mono:300,700&display=swap");
    			attr_dev(link1, "rel", "stylesheet");
    			add_location(link1, file, 47, 1, 1366);
    			add_location(head, file, 42, 0, 1244);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, head, anchor);
    			append_dev(head, link0);
    			append_dev(head, t0);
    			append_dev(head, link1);
    			insert_dev(target, t1, anchor);
    			mount_component(navigation, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(contentcolumn, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const navigation_changes = {};
    			if (dirty & /*theme*/ 1) navigation_changes.theme = /*theme*/ ctx[0].name;
    			navigation.$set(navigation_changes);
    			const contentcolumn_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				contentcolumn_changes.$$scope = { dirty, ctx };
    			}

    			contentcolumn.$set(contentcolumn_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigation.$$.fragment, local);
    			transition_in(contentcolumn.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigation.$$.fragment, local);
    			transition_out(contentcolumn.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(head);
    			if (detaching) detach_dev(t1);
    			destroy_component(navigation, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(contentcolumn, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function setCssVariables(variable_map, variable_name) {
    	for (const [property_name, value] of Object.entries(variable_map)) {
    		const property_path = `${variable_name}-${property_name}`;

    		if (value instanceof Object) {
    			setCssVariables(value, property_path);
    		} else {
    			const property_id = `--${property_path}`;
    			document.documentElement.style.setProperty(property_id, value);
    		}
    	}
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let theme = themes.dark; // TODO: load this from preferences or cookies

    	onMount(() => {
    		setCssVariables(theme, "theme");
    		setCssVariables(style, "style");
    	});

    	function toggleTheme() {
    		if (theme === themes.light) {
    			$$invalidate(0, theme = themes.dark);
    		} else {
    			$$invalidate(0, theme = themes.light);
    		}

    		setCssVariables(theme, "theme");
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Projects,
    		About,
    		Experience,
    		Downloads,
    		ContentColumn,
    		Contact,
    		Navigation,
    		themes,
    		style,
    		onMount,
    		theme,
    		setCssVariables,
    		toggleTheme
    	});

    	$$self.$inject_state = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [theme, toggleTheme];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map

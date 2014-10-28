$(function() {

    Parse.$ = jQuery;

    // Initialize Parse with your Parse application javascript keys
    Parse.initialize("161PlDzBER2S4Yf6bNa1iwT2Cd7mtjYGgCKU2g20",
        "7BGP2GM383Qt7eIzqLxXYWY8VHx5VQ4zSRw7yuXa");

    // This is the transient application state, not persisted on Parse
    var AppState = Parse.Object.extend("AppState", {

        defaults: {
        },

        /**
         * Return a user object with the ID for putting into Parse queries
         */
        getCurrentUserAsObjectWithNoData: function() {
            var tmpUser = new User();
            tmpUser.id = state.get('user');
            return tmpUser;
        }
    });

    var state = new AppState;


    // //
    // MODELS ==================================================
    // //
    var Clue = Parse.Object.extend("Clue", {
        defaults: {
            title: "",
            description: "...",
            clueType: "standard"
        },

        addToStory: function() {
            // Publish a message to global mediator, to which the story collection subscribes
            state.trigger('ps:clue:add_to_story', this);
        }
    });

    var StoryStep = Parse.Object.extend("StoryStep", {
        defaults: {
            order: 0,
            complete: false
        },
        nextOrder: function() {
            if (!this.length) return 1;
            console.log('Anything using this?');
            return this.last().get('order') + 1;
        },

        comparator: function(model) {
            return model.get('order');
        }
    });

    var User = Parse.Object.extend("User", {
    });

    // //
    // COLLECTIONS ==================================================
    // //
    var BaseCollection = Parse.Collection.extend({
        initialize: function() {
            this.query = new Parse.Query(this.model);
        }
    });

    var CluesCollection = BaseCollection.extend({
        model: Clue
    });

    var StoryStepCollection = BaseCollection.extend({
        model: StoryStep,
        initialize: function(arguments) {
            BaseCollection.prototype.initialize.apply(this, arguments);
            this.query.include('Clue');
            state.on('change:user', this.filterUser, this);
            state.on('ps:clue:add_to_story', this.addClue, this);
        },
        nextOrder: function() {
            if (!this.length) return 1;
            return this.last().get('order') + 1;
        },
        filterUser: function() {
            this.query.equalTo('User', state.getCurrentUserAsObjectWithNoData());
            this.fetch();
        },
        addClue: function(clue) {
            var step = new StoryStep({
                User: state.getCurrentUserAsObjectWithNoData(),
                Clue: clue,
                order: this.nextOrder(),
            });
            this.add(step);
            step.save();
        }
    });

    var UserCollection = BaseCollection.extend({
        model: User
    });


    // //
    // ITEM VIEWS ==================================================
    // //
    var BaseItemView = Parse.View.extend({

        tagName:  "tr",

        initialize: function() {
            _.bindAll(this, 'render', 'remove', 'clear');
            this.model.bind('change', this.render);
            this.model.bind('destroy', this.remove);
        },

        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },

        clear: function(evt) {
            if(evt) evt.preventDefault();
            this.model.destroy();
        },

        remove: function() {
            this.$el.remove();
        }
    });

    var ClueItemView = BaseItemView.extend({
        template: _.template($('#clue-item-view').html()),
        className: 'Clue',

        events: {
            'click .js-delete': 'clear',
            'click .js-add-to-story': 'addToStory'
        },

        initialize: function() {
            BaseItemView.prototype.initialize.apply(this, arguments);
            _.bindAll(this, 'addToStory');
        },

        addToStory: function(evt) {
            evt.preventDefault();
            this.model.addToStory();
        }
    });

    var StoryStepItemView = BaseItemView.extend({

        tagName: 'li',
        template: _.template($('#storystep-item-view').html()),
        className: 'StoryStep sortable',

        orderField: 'order',
        overClass: 'over',

        attributes: {
            "draggable": true
        },

        events: {
            "dragstart": "start",
            "dragenter": "enter",
            "dragleave": "leave",
            "dragend": "leave",
            "dragover": "over",
            "drop": "drop",
            'click .js-delete': 'clear'
        },

        initialize: function() {
            BaseItemView.prototype.initialize.apply(this, arguments);
            _.bindAll(this, 'orderChanged');

            this.model.on('change:order', this.orderChanged, this);
        },

        render: function() {
            var data = this.model.toJSON();
            try {
                data.Clue = this.model.get('Clue').toJSON();
            } catch (e) {
                data.Clue = {name: ''};
            }
            this.$el.html(this.template(data));
            return this;
        },

        // Draganddrop functions
        start: function () {
            console.log('This model is being dragged:', this.model.attributes);
            this.parent.draggedModel = this.model;
        },

        enter: function () {
            this.$el.addClass(this.overClass);
        },

        leave: function () {
            this.$el.removeClass(this.overClass);
        },

        over: function (evt) {
            evt.preventDefault();
        },

        drop: function (evt) {
            var newIndex = $(evt.target).index();
            this.leave();
            console.log('Changing order from', this.model.get('order'), 'to:', newIndex);
            this.model.set('order', newIndex);
        },

        orderChanged: function() {
            this.$el.css('background', 'green');
        }
    });


    // //
    // LIST VIEWS ==================================================
    // //
    var BaseListView = Parse.View.extend({
        itemsContainer: 'tbody',
        initialize: function() {
            this.collection = new this.Collection();

            _.bindAll(this, 'addOne', 'addAll', 'render');

            this.collection.on('add', this.addOne);
            this.collection.on('reset', this.addAll);
            this.collection.on('all', this.render);

            // Fetch all the todo items for this user
            this.collection.fetch();
        },

        render: function() {
            this.addAll();
            this.trigger('render');
            return this;
        },

        addOne: function(model) {
            var view = new this.ItemView({model: model});
            view.parent = this;
            this.$(this.itemsContainer).append(view.render().el);
        },

        addAll: function(collection, filter) {
            this.$(this.itemsContainer).html("");
            this.collection.each(this.addOne);
        }
    });

    var ClueListView = BaseListView.extend({
        el: '.js-list-clues',
        Collection: CluesCollection,
        ItemView: ClueItemView,

        events: {
        }
    });

    var UserListView = BaseListView.extend({
        Collection: UserCollection,
        el: '.js-users',

        events: {
            'change': 'onChange'
        },

        initialize: function() {
            BaseListView.prototype.initialize.apply(this, arguments);
            this.on('render', this.setCurrent, this);
        },

        addOne: function(model) {
            this.$el.append('<option value="' + model.id + '">' + model.get('username') + '</option>');
        },

        addAll: function(collection, filter) {
            this.$el.html("");
            this.collection.each(this.addOne);
        },

        onChange: function(evt) {
            // Push a hash to /user/:id with the ID
            var uid = this.$el.find('option:selected').val();
            Parse.history.navigate('user/' + uid, {trigger: true});
        },

        setCurrent: function() {
            this.$el.val(state.get('user'));
        }
    });

    var StoryStepListView = BaseListView.extend({
        el: '.js-story-steps',
        Collection: StoryStepCollection,
        ItemView: StoryStepItemView,
        itemsContainer: '.js-items',

        initialize: function() {
            BaseListView.prototype.initialize.apply(this, arguments);

            this.$save = this.$('.js-save');

            // Events
            this.collection.on('add', this.changed, this);
            this.collection.on('save', this.saved, this);
        },

        events: {
            'click .js-save': 'save'
        },

        changed: function() {
            console.log('Updates to step collection');
            this.$save.removeClass('disabled');
        },

        saved: function() {
            console.log('Step colletion synced with Parse');
            this.$save.addClass('disabled');
        },

        save: function(evt) {
            evt.preventDefault();
            this.collection.save();
        }
    });


    // //
    // APP VIEW ==================================================
    // //
    var AppView = Parse.View.extend({

        // Delegated events for creating new items, and clearing completed ones.
        events: {
        },

        el: ".js-app-view",

        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved to Parse.
        initialize: function() {
            var self = this;

            // Subviews
            window.userListView = this.userListview = new UserListView();
            window.storyStepListView = this.storyStepListview = new StoryStepListView();
            window.clueListView = this.clueListView = new ClueListView();

            // Listen to this from story step collection.
            // Should be changed by hash
            state.on("change:user", this.filterUser, this);
        }
    });

    var AppRouter = Parse.Router.extend({
        routes: {
            "user/:user_id": "setUser"
        },

        setUser: function(user_id) {
            state.set({ user: user_id });
        }
    });


    window.appRouter = new AppRouter;
    window.appView = new AppView;
    Parse.history.start();
});

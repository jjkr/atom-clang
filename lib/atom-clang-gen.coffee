AtomClangGenView = require './atom-clang-gen-view'
{CompositeDisposable} = require 'atom'

module.exports = AtomClangGen =
  atomClangGenView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    @atomClangGenView = new AtomClangGenView(state.atomClangGenViewState)
    @modalPanel = atom.workspace.addModalPanel(item: @atomClangGenView.getElement(), visible: false)

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'atom-clang-gen:toggle': => @toggle()

  deactivate: ->
    @modalPanel.destroy()
    @subscriptions.dispose()
    @atomClangGenView.destroy()

  serialize: ->
    atomClangGenViewState: @atomClangGenView.serialize()

  toggle: ->
    console.log 'AtomClangGen was toggled!'

    if @modalPanel.isVisible()
      @modalPanel.hide()
    else
      @modalPanel.show()

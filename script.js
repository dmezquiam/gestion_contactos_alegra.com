Ext.require(['Ext.data.*', 'Ext.grid.*']);

Ext.define('Contacto', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, 'name', 'identification', 'phonePrimary', 'observations'],
    validations: [{
        type: 'length',
        field: 'name',
        min: 1
    }, {
        type: 'length',
        field: 'identification',
        min: 1
    }, {
        type: 'length',
        field: 'phonePrimary',
        min: 1
    }, {
        type: 'length',
        field: 'observations',
        min: 1
    }]
});

Ext.onReady(function(){
    var store = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'Contacto',
        proxy: {
            type: 'rest',
            url: 'controller.php',
            reader: {
                type: 'json',
                rootProperty: 'data'
            },
            writer: {
                type: 'json'
            }
        }
    });

   // Editar contacto
    var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            //clicksToEdit: 2,
            saveBtnText: 'Editar',
            cancelBtnText: 'Cancelar',
            listeners: {
                canceledit: function (editor, e, eOpts) {
                    //e.store.remove(e.record);
                },
                edit: function (editor, e, eOpts) {
                    Ext.Msg.confirm('Confirmar', 'Seguro que deseea editar el contacto?', function(result){
                        if(result === "yes"){
                            Ext.Ajax.request({
                                url: 'controller.php', 
                                method : 'POST',
                                params: { // Enviar datos al controlador para editar
                                    pull : 'true',
                                    id : e.record.get('id'),
                                    name : e.record.get('name'),
                                    iden : e.record.get('identification'),
                                    telef1 : e.record.get('phonePrimary'),
                                    observaciones : e.record.get('observations')
                                },
                               success: function() {
                                    store.reload();
                                    Ext.Msg.alert('OK!!!', 'Contacto editado correctamente');
                                },
                                failure: function() {
                                Ext.Msg.alert('Error', 'No se pudo editar el contacto, vuelva a intentarlo');
                                }
                            });
                        }else{ store.reload(); }
                    }, this);   
                }
            }
        });

    var grid = Ext.create('Ext.grid.Panel', {
        renderTo: document.body,
        plugins: [rowEditing],
        width: 1000,
        height: 400,
        frame: true,
        title: 'Contactos',
        store: store,
        //iconCls: 'icon-user1',
        columns: [{
            text: 'Nombre',
            flex: 1,
            width: 400,
            sortable: false,
            dataIndex: 'name',
            field: {
                xtype: 'textfield'
            }
        }, {
            header: 'Identificación',
            width: 200,
            sortable: false,
            dataIndex: 'identification',
            field: {
                xtype: 'textfield'
            }
        }, {
            text: 'Teléfono 1',
            width: 200,
            sortable: false,
            dataIndex: 'phonePrimary',
            field: {
                xtype: 'textfield'
            }
        }, {
            text: 'Observaciones',
            width: 200,
            sortable: false,
            dataIndex: 'observations',
            field: {
                xtype: 'textfield'
            }
        }],
        dockedItems: [{
                xtype: 'pagingtoolbar',
                dock: 'bottom',
                displayInfo: true
            },{
            xtype: 'toolbar',
            items: [{
                text: 'Nuevo',
                iconCls: 'icon-add',
                handler: function(){
                           Ext.create('Ext.form.Panel', {
                              title: 'Adicionar contacto',
                              renderTo: Ext.getBody(),
                              bodyPadding: 10,
                              frame: true,
                              layout: 'form',
                              width: 500,
                              floating: true,
                              closable : true,
                              items: [{
                                  xtype: 'textfield',
                                  fieldLabel: 'Nombre',
                                  name: 'name',
                                  type: 'string',
                                  allowBlank: false
                              },{
                                  xtype: 'textfield',
                                  fieldLabel: 'Identificación',
                                  name: 'iden'
                              },{
                                  xtype: 'textfield',
                                  fieldLabel: 'Dirección',
                                  name: 'address'
                              },{
                                  xtype: 'textfield',
                                  fieldLabel: 'Ciudad',
                                  name: 'city'
                              },{
                                  xtype: 'textfield',
                                  fieldLabel: 'Correo electrónico',
                                  name: 'email',
                                  vtype: 'email',
                                  invalidText: 'Revise el correo'
                              },{
                                  xtype: 'textfield',
                                  fieldLabel: 'Teléfono 1',
                                  name: 'telef1'
                              },{
                                  xtype: 'textfield',
                                  fieldLabel: 'Teléfono 2',
                                  name: 'telef2'
                              },{
                                  xtype: 'textfield',
                                  fieldLabel: 'Fax',
                                  name: 'fax'
                              },{
                                  xtype: 'textfield',
                                  fieldLabel: 'Celular',
                                  name: 'cell'
                              },{
                                  xtype: 'textareafield',
                                  fieldLabel: 'Observaciones',
                                  name: 'obse'
                              }],
                              buttons: [{
                                  text: 'Guardar',
                                  handler: function() {
                                      var form = this.up('form').getForm();
                                       if (form.isValid() && form.getValues().name !== "") {
                                              Ext.Ajax.request({ //Enviar datos al controlador para guardarlos
                                                      url: 'controller.php',
                                                  params: {
                                                      name : form.getValues().name,
                                                      iden : form.getValues().iden,
                                                      direccion : form.getValues().address,
                                                      ciudad : form.getValues().city,
                                                      email : form.getValues().email,
                                                      telef1 : form.getValues().telef1,
                                                      telef2 : form.getValues().telef2, 
                                                      fax : form.getValues().fax, 
                                                      cell : form.getValues().cell, 
                                                      observaciones : form.getValues().obse
                                                  },
                                                  success: function() {
                                                      store.reload();
                                                      Ext.Msg.alert('OK!!!', 'Nuevo contacto añadido');
                                                      form.reset();
                                                    },
                                                  failure: function() {
                                                      Ext.Msg.alert('Error!!!', 'No se pudo añadir el contacto');
                                                  }
                                              }); 
                                          }
                                          else { 
                                              Ext.Msg.alert('Error', 'Verifique los datos');
                                          }  
                                  }
                              }]
                          });
                }
            }, '-', {
                itemId: 'delete',
                text: 'Eliminar',
                disabled: true,
                iconCls: 'icon-delete',
                handler: function(){ //Eliminar un contacto dado su id.
                    var id = grid.getView().getSelectionModel().getSelection()[0].getId();   
                        Ext.Msg.confirm('Confirmar', 'Seguro que deseea eliminar el contacto?', function(result){
                        if(result === "yes"){
                            Ext.Ajax.request({
                                url: 'controller.php',
                                method : 'POST',
                            params: {
                                id : id,
                                delete : 'true'
                            },
                            success: function() {
                                store.reload();
                                Ext.Msg.alert('OK!!!', 'Contacto eliminado');
                            },
                            failure: function() {
                                Ext.Msg.alert('Error', 'No se pudo eliminar el contacto, vuelva a intentarlo');
                            }
                          });
                        }
                    }, this);      
                }
            }, '-', {
                itemId: 'edit',
                text: 'Editar',
                disabled: false,
                iconCls: 'icon-user',
                handler: function(){
                    var objrow = grid.getView().getSelectionModel().getSelection()[0];
                    rowEditing.startEdit(objrow);
                }
            }]
        }]
    });
    grid.getSelectionModel().on('selectionchange', function(selModel, selections){
        grid.down('#delete').setDisabled(selections.length === 0);
    });
});


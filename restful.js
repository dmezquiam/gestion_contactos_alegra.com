Ext.require(['Ext.data.*', 'Ext.grid.*']);

Ext.define('Person', {
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
        model: 'Person',
        proxy: {
            type: 'rest',
            url: 'app.php',
            reader: {
                type: 'json',
                rootProperty: 'data'
            },
            writer: {
                type: 'json'
            }
        },
        listeners: {
            write: function(store, operation){
                var record = operation.getRecords()[0],
                    name = Ext.String.capitalize(operation.action),
                    verb;
                    
                    
                if (name == 'Destroy') {
                    verb = 'Destroyed';
                } else {
                    verb = name + 'd';
                }
                Ext.example.msg(name, Ext.String.format("{0} user: {1}", verb, record.getId()));
                
            }
        }
    });
    
    var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        listeners: {
            cancelEdit: function(rowEditing, context) {
                // Canceling editing of a locally added, unsaved record: remove it
                if (context.record.phantom) {
                    store.remove(context.record);
                }
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
        iconCls: 'icon-user',
        columns: [{
            text: 'ID',
            width: 50,
            sortable: false,
            dataIndex: 'id',
            renderer: function(v, meta, rec) {
                return rec.phantom ? '' : v;
            }
        }, {
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
            xtype: 'toolbar',
            items: [{
                text: 'Nuevo',
                iconCls: 'icon-add',
                handler: 'onAddClick'
//                handler: function(){
//                    // empty record
//                    Ext.Msg.alert('Status', 'jjhyggffflololo');
//                }
            }, '-', {
                itemId: 'delete',
                text: 'Eliminar',
                disabled: true,
                iconCls: 'icon-delete',
                handler: function(){
                    var id = grid.getView().getSelectionModel().getSelection()[0].getId();
                    if (id) {
                        Ext.Ajax.request({
                                url: 'app.php',
                                method : 'POST',
                            params: {
                                id : id,
                                delete : 'true'
                            },
                            success: function(form, action) {
                                store.reload();
                                Ext.Msg.alert('Success', 'Contacto eliminado');
                            },
                            failure: function(form, action) {
                                Ext.Msg.alert('Error', 'No se pudo añadir el contacto');
                            }
                        });
                    }
                }
            }, '-', {
                itemId: 'edit',
                text: 'Modificar',
                disabled: false,
                iconCls: 'icon-delete',
                handler: function(){
                    var id = grid.getView().getSelectionModel().getSelection()[0].getId();
                    if (id) {
                        
                    }
                }
            }]
        }]
    });
    grid.getSelectionModel().on('selectionchange', function(selModel, selections){
        grid.down('#delete').setDisabled(selections.length === 0);
    });



    Ext.create('Ext.form.Panel', {
        title: 'Adicionar contacto',
        renderTo: Ext.getBody(),
        bodyPadding: 5,
        width: 350,
        url: 'app.php',
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Nombre',
            name: 'name'
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
            name: 'email'
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
            xtype: 'textfield',
            fieldLabel: 'Observaciones',
            name: 'obse'
        }],

        buttons: [{
            text: 'Guardar',
            handler: function() {
                var form = this.up('form').getForm();
                //if (form.isValid()) {
                        Ext.Ajax.request({
                                url: 'app.php',
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
                            
                            success: function(form, action) {
                                store.reload();
                                Ext.Msg.alert('Success', 'Nuevo contacto añadido');
                            },
                            failure: function(form, action) {
                                Ext.Msg.alert('Error', 'No se pudo añadir el contacto');
                            }
                        });  
            }
        }]
    });
   
});


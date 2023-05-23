migrate((db) => {
  const collection = new Collection({
    "id": "fjlxvgd1jxwc6m5",
    "created": "2023-05-23 06:35:19.101Z",
    "updated": "2023-05-23 06:35:19.101Z",
    "name": "product",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "isap9l9v",
        "name": "name",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "rltfhpfr",
        "name": "description",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "ok4qiqug",
        "name": "price",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("fjlxvgd1jxwc6m5");

  return dao.deleteCollection(collection);
})

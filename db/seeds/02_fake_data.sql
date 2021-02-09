insert into users (name, email, password, telephone, is_admin)
values
('Chris', 'c@c.com','password', '5144624478', false),
('Sebas', 's@c.com','password','5144624478', false),
('Alex', 'a@c.com','password','5144624478', false),
('Admin', 'admin@lux.com','password','5144624478', true);

insert into orders (users_id)
values
(1),
(2),
(3);

insert into menu_items (name, price, prep_time,type_plate, is_active)
values
('Osso Bucco', 55, 60, 'main', 'true'),
('Foie gras with truffles', 25, 10, 'entry', 'true'),
('Olypus Cheeze cake', 15, 5, 'dessert', 'true'),
('Petrus 1994', 5995, 5, 'wine', 'true'),
('Royal duck', 75, 60, 'main', 'true'),
('Selection of cheeses', 35, 10, 'entry', 'true'),
('Wild salmon tartare', 85, 60, 'main', 'true'),
('Paris Brest', 25, 60, 'dessert', 'true'),
('Dom Perignion', 455, 5, 'wine', 'true');

insert into orders_content (orders_id, menu_item_id)
values
(1,1),
(1,4),
(1,5),
(1,2),
(1,7),
(2,1),
(2,2),
(2,3),
(3,4),
(3,5),
(3,6),
(3,7);

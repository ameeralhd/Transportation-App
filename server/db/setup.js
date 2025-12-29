const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const args = process.argv.slice(2);
const reset = args.includes('--reset');

db.serialize(() => {
    if (reset) {
        console.warn("WARNING: --reset flag detected. Wiping database...");
        db.run("DROP TABLE IF EXISTS bookings");
        db.run("DROP TABLE IF EXISTS schedules");
        db.run("DROP TABLE IF EXISTS users");
        db.run("DROP TABLE IF EXISTS blogs");
        db.run("DROP TABLE IF EXISTS activity_logs");
        db.run("DROP TABLE IF EXISTS hotels");
        db.run("DROP TABLE IF EXISTS hotel_bookings");
        db.run("DROP TABLE IF EXISTS rental_bookings");
        db.run("DROP TABLE IF EXISTS rental_cars");
    }

    // Create Hotel Bookings Table
    db.run(`CREATE TABLE IF NOT EXISTS hotel_bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        hotelId INTEGER,
        checkIn TEXT,
        checkOut TEXT,
        guests INTEGER,
        contact_details TEXT,
        total_price REAL,
        status TEXT DEFAULT 'confirmed',
        FOREIGN KEY(userId) REFERENCES users(id),
        FOREIGN KEY(hotelId) REFERENCES hotels(id)
    )`);

    // Create Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT,
        full_name TEXT,
        phone TEXT
    )`);

    // Create Schedules Table
    db.run(`CREATE TABLE IF NOT EXISTS schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source TEXT,
        destination TEXT,
        departureTime TEXT,
        arrivalTime TEXT,
        price REAL,
        availableSeats INTEGER
    )`);

    // Create Bookings Table
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        scheduleId INTEGER,
        bookingDate TEXT,
        passengers INTEGER DEFAULT 1,
        contact_details TEXT,
        status TEXT DEFAULT 'confirmed',
        cancellation_reason TEXT,
        FOREIGN KEY(userId) REFERENCES users(id),
        FOREIGN KEY(scheduleId) REFERENCES schedules(id)
    )`);

    // Create Blogs Table
    db.run(`CREATE TABLE IF NOT EXISTS blogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        author TEXT,
        created_at TEXT,
        image_url TEXT
    )`);

    // Create Activity Logs Table
    db.run(`CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_id INTEGER,
        action TEXT,
        details TEXT,
        timestamp TEXT,
        FOREIGN KEY(admin_id) REFERENCES users(id)
    )`);

    // Create Hotels Table
    db.run(`CREATE TABLE IF NOT EXISTS hotels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        city TEXT,
        address TEXT,
        price_per_night REAL,
        rating REAL,
        image_url TEXT,
        amenities TEXT,
        latitude REAL,
        longitude REAL
    )`);

    // Create Rental Cars Table
    db.run(`CREATE TABLE IF NOT EXISTS rental_cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        city TEXT,
        type TEXT,
        price_per_day REAL,
        seats INTEGER,
        image_url TEXT,
        latitude REAL,
        longitude REAL
    )`);

    // Create Rental Bookings Table
    db.run(`CREATE TABLE IF NOT EXISTS rental_bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        carId INTEGER,
        startDate TEXT,
        endDate TEXT,
        totalPrice REAL,
        contact_details TEXT,
        driver_license TEXT,
        status TEXT DEFAULT 'confirmed',
        created_at TEXT,
        FOREIGN KEY(userId) REFERENCES users(id),
        FOREIGN KEY(carId) REFERENCES rental_cars(id)
    )`);

    // Seed Data safely
    db.get("SELECT count(*) as count FROM users", (err, row) => {
        if (err) console.error(err);
        else if (row.count === 0) {
            console.log("Seeding Users...");
            const adminPass = bcrypt.hashSync('admin123', 10);
            const userPass = bcrypt.hashSync('password', 10);
            const insertUser = db.prepare("INSERT INTO users (username, password, role, full_name, phone) VALUES (?, ?, ?, ?, ?)");
            insertUser.run('admin', adminPass, 'admin', 'Admin User', '081234567890');
            insertUser.run('ameer', userPass, 'user', 'Ameer User', '081298765432');
            insertUser.finalize();
        }
    });

    db.get("SELECT count(*) as count FROM hotels", (err, row) => {
        if (err) console.error(err);
        else if (row.count === 0) {
            console.log("Seeding Hotels...");
            const insertHotel = db.prepare("INSERT INTO hotels (name, city, address, price_per_night, rating, image_url, amenities, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            const hotelData = [
                // Jakarta
                ['Grand Hyatt', 'Jakarta', 'Jalan M.H. Thamrin Kav. 28-30', 2500000, 4.8, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', 'Pool, Gym, Spa, WiFi', -6.1944, 106.8229],
                ['Pullman Central Park', 'Jakarta', 'Podomoro City, Letjen S. Parman', 1800000, 4.7, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80', 'Pool, WiFi, Bar', -6.1774, 106.7909],

                // Bandung
                ['Padma Hotel', 'Bandung', 'Jl. Ranca Bentang No. 56-58', 3500000, 4.9, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=400&q=80', 'Mountain View, Pool, WiFi', -6.8373, 107.6062],
                ['Trans Luxury Hotel', 'Bandung', 'Jl. Gatot Subroto No. 289', 2200000, 4.8, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=400&q=80', 'Pool, Mall Access, WiFi', -6.9264, 107.6365],

                // Yogyakarta
                ['Melia Purosani', 'Yogyakarta', 'Jl. Mayor Suryotomo No. 31', 1200000, 4.6, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=400&q=80', 'Garden, Pool, WiFi', -7.8003, 110.3691],
                ['Royal Ambarrukmo', 'Yogyakarta', 'Jl. Laksda Adisucipto No. 81', 1500000, 4.7, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80', 'History, Pool, WiFi', -7.7828, 110.4009],
                ['Ayaartta Hotel', 'Yogyakarta', 'Jl. KH. Ahmad Dahlan No. 123', 600000, 4.3, 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=400&q=80', 'Pool, WiFi', -7.8037, 110.3547],

                // Solo (Surakarta)
                ['Alila Solo', 'Surakarta (Solo)', 'Jl. Slamet Riyadi No. 562', 1300000, 4.7, 'https://images.unsplash.com/photo-1571896349842-6e53ce41e8f2?auto=format&fit=crop&w=400&q=80', 'Sky Lounge, Pool, WiFi', -7.5583, 110.7853],
                ['The Royal Surakarta', 'Surakarta (Solo)', 'Jl. Slamet Riyadi No. 6', 700000, 4.4, 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=400&q=80', 'Bathtub, WiFi', -7.5683, 110.8253],

                // Semarang
                ['Gumaya Tower Hotel', 'Semarang', 'Jl. Gajahmada No. 59-61', 1100000, 4.6, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=400&q=80', 'City View, Pool', -6.9774, 110.4203],
                ['Hotel Ciputra', 'Semarang', 'Simpang Lima', 950000, 4.5, 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=400&q=80', 'Mall Access, Pool, Gym', -6.9899, 110.4230],

                // Surabaya
                ['JW Marriott', 'Surabaya', 'Jl. Embong Malang No. 85-89', 1600000, 4.6, 'https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&w=400&q=80', 'Luxury, Pool, Gym', -7.2625, 112.7394],
                ['Majapahit Hotel', 'Surabaya', 'Jl. Tunjungan No. 65', 1400000, 4.8, 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=400&q=80', 'Historic, Garden, Spa', -7.2592, 112.7383],

                // Bali (Denpasar area)
                ['Hard Rock Hotel', 'Denpasar', 'Jalan Pantai Kuta', 1900000, 4.5, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80', 'Beach, Pool, Rock N Roll', -8.7212, 115.1691],
                ['The Anvaya Beach Resort', 'Denpasar', 'Jl. Kartika Plaza', 2100000, 4.8, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80', 'Private Beach, Pool', -8.7289, 115.1659],

                // Malang
                ['Tugu Malang', 'Malang', 'Jl. Tugu No. 3', 1800000, 4.9, 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?auto=format&fit=crop&w=400&q=80', 'Museum, Historic, Spa', -7.9771, 112.6340],
                ['Harris Hotel & Conventions', 'Malang', 'Jl. A Yani Utara', 700000, 4.4, 'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&w=400&q=80', 'Pool, Gym, Kids Club', -7.9358, 112.6450],

                // Bogor
                ['Royal Tulip Gunung Geulis', 'Bogor', 'Jl. Pasir Angin Gadog', 2500000, 4.7, 'https://images.unsplash.com/photo-1580977250629-9e1208a0d7d7?auto=format&fit=crop&w=400&q=80', 'Resort, Golf, View', -6.6548, 106.8778],
                ['Aston Bogor', 'Bogor', 'The Jungle, BCR', 1100000, 4.5, 'https://images.unsplash.com/photo-1549480017-d76466a4b7e8?auto=format&fit=crop&w=400&q=80', 'Pool, Nature, Family', -6.6373, 106.8049],

                // Medan
                ['JW Marriott Medan', 'Medan', 'Jl. Putri Hijau No. 10', 1700000, 4.8, 'https://images.unsplash.com/photo-1571896349842-6e53ce41e8f2?auto=format&fit=crop&w=400&q=80', 'Luxury, Infinity Pool', 3.5959, 98.6750],
                ['Adimulia Hotel', 'Medan', 'Jl. Pangeran Diponegoro No. 8', 1300000, 4.6, 'https://images.unsplash.com/photo-1562133567-b6a0a9c7e6eb?auto=format&fit=crop&w=400&q=80', 'Classic, Pool, Gym', 3.5852, 98.6749]
            ];
            hotelData.forEach(h => insertHotel.run(...h));
            insertHotel.finalize();
        }
    });

    db.get("SELECT count(*) as count FROM rental_cars", (err, row) => {
        if (err) console.error(err);
        else if (row.count === 0) {
            console.log("Seeding Rental Cars...");
            const insertCar = db.prepare("INSERT INTO rental_cars (name, city, type, price_per_day, seats, image_url, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            const carData = [
                ['Toyota Avanza', 'Jakarta', 'MPV', 350000, 7, 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80', -6.2088, 106.8456],
                ['Honda Brio', 'Jakarta', 'City Car', 300000, 4, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80', -6.2200, 106.8200],
                ['Toyota Innova Zenix', 'Bandung', 'MPV', 600000, 7, 'https://images.unsplash.com/photo-1627454819213-17727e466d50?auto=format&fit=crop&w=400&q=80', -6.9175, 107.6191],
                ['Mitsubishi Pajero', 'Bandung', 'SUV', 800000, 7, 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80', -6.9300, 107.6000],
                ['Suzuki Jimny', 'Yogyakarta', 'SUV', 750000, 4, 'https://images.unsplash.com/photo-1599818856525-46b5dc26f9e8?auto=format&fit=crop&w=400&q=80', -7.7956, 110.3695],
                ['Toyota Hiace', 'Yogyakarta', 'Minibus', 1200000, 14, 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=400&q=80', -7.7800, 110.3900],
                ['Toyota Agya', 'Surakarta (Solo)', 'City Car', 250000, 4, 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80', -7.5755, 110.8243],
                ['Daihatsu Xenia', 'Semarang', 'MPV', 320000, 7, 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=400&q=80', -6.9667, 110.4167],
                ['Toyota Fortuner', 'Surabaya', 'SUV', 850000, 7, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=80', -7.2575, 112.7521],
                ['Honda HR-V', 'Denpasar', 'SUV', 500000, 5, 'https://images.unsplash.com/photo-1606577924006-27d39b132ae2?auto=format&fit=crop&w=400&q=80', -8.6705, 115.2126],
                ['Toyota Alphard', 'Denpasar', 'Luxury MPV', 2000000, 7, 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=400&q=80', -8.6900, 115.1700]
            ];
            carData.forEach(c => insertCar.run(...c));
            insertCar.finalize();
        }
    });

    db.get("SELECT count(*) as count FROM schedules", (err, row) => {
        if (err) console.error(err);
        else if (row.count === 0) {
            console.log("Seeding Schedules...");
            const insertSchedule = db.prepare(`INSERT INTO schedules (source, destination, departureTime, arrivalTime, price, availableSeats) VALUES (?, ?, ?, ?, ?, ?)`);

            const cities = [
                'Jakarta', 'Bandung', 'Yogyakarta', 'Surakarta (Solo)', 'Semarang',
                'Surabaya', 'Malang', 'Denpasar', 'Magelang', 'Bogor',
                'Medan', 'Palembang', 'Makassar', 'Bekasi', 'Tangerang', 'Depok'
            ];

            const generateRandomTime = (dateStr, startHour, endHour) => {
                const date = new Date(dateStr);
                const hour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
                const minute = Math.floor(Math.random() * 60);
                date.setHours(hour, minute, 0, 0);
                return date;
            };

            const addHours = (date, hours) => {
                const newDate = new Date(date);
                newDate.setTime(newDate.getTime() + (hours * 60 * 60 * 1000));
                return newDate;
            };

            // Generate routes for specific dates
            const targetDates = ['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29', '2025-12-30', '2026-01-01'];

            cities.forEach(sourceCity => {
                // Create 5 routes for each city per date
                targetDates.forEach(dateStr => {
                    // Create a copy of cities excluding source
                    const destinations = cities.filter(c => c !== sourceCity);

                    // Shuffle and pick 5 distinct destinations
                    for (let i = destinations.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [destinations[i], destinations[j]] = [destinations[j], destinations[i]];
                    }
                    const selectedDestinations = destinations.slice(0, 5);

                    selectedDestinations.forEach(destCity => {
                        // Random Departure between 6 AM and 8 PM
                        const departure = generateRandomTime(dateStr, 6, 20);

                        // Duration between 2 and 12 hours
                        const duration = Math.floor(Math.random() * 10) + 2;
                        const arrival = addHours(departure, duration);

                        // Price relative to duration
                        const price = Math.floor((duration * 50000) + (Math.random() * 50000));
                        const seats = 20 + Math.floor(Math.random() * 30); // 20-50 seats

                        insertSchedule.run(
                            sourceCity,
                            destCity,
                            departure.toISOString(),
                            arrival.toISOString(),
                            price,
                            seats
                        );
                    });
                });
            });

            // Ensure specific test case: Surakarta to Jakarta on Dec 29
            insertSchedule.run('Surakarta (Solo)', 'Jakarta', '2025-12-29T08:00:00.000Z', '2025-12-29T14:00:00.000Z', 250000, 40);
            insertSchedule.run('Surakarta (Solo)', 'Jakarta', '2025-12-29T16:00:00.000Z', '2025-12-29T22:00:00.000Z', 280000, 35);

            insertSchedule.finalize();
            console.log(`Database initialized with comprehensive routes for ${cities.length} cities.`);
        }
    });
});

// Setup Complete
console.log("Database setup logic completed. Waiting for operations to finish...");

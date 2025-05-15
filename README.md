# School Medical Management System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## Overview

The School Medical Management System is a comprehensive web application designed to streamline healthcare management in educational institutions. It connects school administrators, parents, nurses, and students to create an efficient, transparent healthcare ecosystem within the school environment.

## Key Features

- **Health Information Portal**: Central hub for school health information, educational resources, and health experience blogs
- **Student Health Records Management**: Track and manage student health records including allergies, chronic conditions, immunizations, and treatment history
- **Medication Administration**: Allow parents to submit medication requests that school nurses can process and administer
- **Health Incident Management**: Record and monitor health incidents within the school (injuries, illnesses, outbreaks)
- **Vaccination Management**: Track vaccination schedules and send automated reminders to parents
- **Health Screening Programs**: Organize and manage regular health screenings with automatic notification and result reporting
- **Medical Inventory Management**: Track medical supplies within the school clinic
- **Dashboard & Analytics**: Generate comprehensive reports on health trends within the school

## Primary Users

- **Students**: Access personal health information and resources
- **Parents**: Submit health information, medication requests, and receive updates about their children
- **School Nurses**: Manage daily healthcare operations and student medical needs
- **School Administrators**: Oversee health programs and access analytics
- **Medical Staff**: Record and track health incidents and treatment

## Technology Stack

- **Frontend**: React.js with modern UI libraries
- **Backend**: Node.js/Express
- **Database**: MongoDB
- **Authentication**: JWT with role-based access control
- **Hosting**: AWS/Azure Cloud Services

## Getting Started

### Prerequisites

- Node.js (v14.0+)
- MongoDB (v4.0+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/19NgXuanToan11/medical.git

# Navigate to the project directory
cd medical

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the development server
npm run dev
```

### Environment Setup

Create a `.env` file with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/school-medical-system
JWT_SECRET=your_jwt_secret
```

## Project Structure

```
medical/
├── client/                # React frontend
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── services/          # Business logic
├── config/                # Configuration files
├── docs/                  # Documentation
└── tests/                 # Test suites
```

## API Documentation

The API documentation is available at `/api/docs` when running the development server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- FPT University SWP391 course
- All contributors and team members

## Contact

Project Link: [https://github.com/19NgXuanToan11/medical](https://github.com/19NgXuanToan11/medical)

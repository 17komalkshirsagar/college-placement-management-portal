import mongoose from 'mongoose';
import Application from '../models/Application.model.js';
import Analytics from '../models/Analytics.model.js';
import CompanyProfile from '../models/Company.model.js';
import Job from '../models/Job.model.js';
import Role from '../models/Role.model.js';
import StudentProfile from '../models/Student.model.js';
import User from '../models/User.model.js';
import { env } from '../config/env.js';
import { hashPassword } from '../utils/password.js';
const ADMIN_LOGIN_EMAIL = 'admin@college.edu';
const ADMIN_LOGIN_PASSWORD = 'Admin@1234';
export const seedComprehensiveData = async () => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(env.MONGODB_URI);
            console.log('Connected to MongoDB for seeding');
        }
        const existingUsers = await User.countDocuments();
        if (existingUsers > 0) {
            console.log('Seed skipped: user data already exists');
            return;
        }
        console.log('Seeding roles...');
        const roles = await Role.insertMany([
            { name: 'admin', description: 'Training and Placement Officer' },
            { name: 'student', description: 'Student access' },
            { name: 'company', description: 'Company access' },
        ]);
        const roleMap = new Map(roles.map((role) => [role.name, role._id]));
        console.log('Seeding fixed admin...');
        await User.create({
            fullName: 'Admin',
            email: ADMIN_LOGIN_EMAIL,
            password: await hashPassword(ADMIN_LOGIN_PASSWORD),
            role: roleMap.get('admin'),
            roleName: 'admin',
            isVerified: true,
            status: 'active',
        });
        console.log(`Admin login email: ${ADMIN_LOGIN_EMAIL}`);
        console.log(`Admin login password: ${ADMIN_LOGIN_PASSWORD}`);
        console.log('Seeding students...');
        const studentUsers = await User.insertMany([
            {
                fullName: 'Aarav Sharma',
                email: 'student1@college.edu',
                password: await hashPassword('Aarav@3210'),
                role: roleMap.get('student'),
                roleName: 'student',
                isVerified: true,
            },
            {
                fullName: 'Isha Verma',
                email: 'student2@college.edu',
                password: await hashPassword('Isha@6543'),
                role: roleMap.get('student'),
                roleName: 'student',
                isVerified: true,
            },
        ]);
        const students = await StudentProfile.insertMany([
            {
                user: studentUsers[0]._id,
                mobileNumber: '9876543210',
                course: 'B.Tech',
                branch: 'Computer Science',
                year: 4,
                skills: ['TypeScript', 'Node.js', 'React'],
            },
            {
                user: studentUsers[1]._id,
                mobileNumber: '9123456543',
                course: 'B.Tech',
                branch: 'Information Technology',
                year: 4,
                skills: ['Java', 'SQL'],
            },
        ]);
        console.log('Seeding companies...');
        const companyUsers = await User.insertMany([
            {
                fullName: 'Acme Technologies',
                email: 'hr@acme.com',
                password: await hashPassword('Acme@1122'),
                role: roleMap.get('company'),
                roleName: 'company',
                isVerified: true,
            },
            {
                fullName: 'Globex Systems',
                email: 'hr@globex.com',
                password: await hashPassword('Globex@3344'),
                role: roleMap.get('company'),
                roleName: 'company',
                isVerified: true,
            },
        ]);
        const companies = await CompanyProfile.insertMany([
            {
                user: companyUsers[0]._id,
                companyName: 'Acme Technologies',
                hrEmail: 'hr@acme.com',
                hrMobileNumber: '9000011122',
                website: 'https://acme.example.com',
                industry: 'Software',
                headquarters: 'Bengaluru',
                isActive: true,
            },
            {
                user: companyUsers[1]._id,
                companyName: 'Globex Systems',
                hrEmail: 'hr@globex.com',
                hrMobileNumber: '9000033344',
                website: 'https://globex.example.com',
                industry: 'Fintech',
                headquarters: 'Pune',
                isActive: true,
            },
        ]);
        console.log('Seeding jobs...');
        const jobs = await Job.insertMany([
            {
                company: companies[0]._id,
                title: 'Software Engineer',
                description: 'Build scalable backend systems',
                location: 'Bengaluru',
                packageLpa: 12,
                eligibility: 'BE/BTech CSE/IT 2026 passout',
                deadline: new Date('2026-07-01T00:00:00.000Z'),
                isActive: true,
            },
            {
                company: companies[1]._id,
                title: 'Data Analyst',
                description: 'Analyze product and business metrics',
                location: 'Pune',
                packageLpa: 9,
                eligibility: 'BE/BTech all branches 2026 passout',
                deadline: new Date('2026-07-10T00:00:00.000Z'),
                isActive: true,
            },
        ]);
        console.log('Seeding applications...');
        const applications = await Application.insertMany([
            {
                student: students[0]._id,
                job: jobs[0]._id,
                status: 'shortlisted',
                resumeUrl: 'http://localhost:5001/uploads/resumes/sample-resume-1.pdf',
                decisionHistory: [
                    { status: 'applied', updatedAt: new Date('2026-06-01T00:00:00.000Z') },
                    { status: 'shortlisted', updatedAt: new Date('2026-06-05T00:00:00.000Z') },
                ],
            },
            {
                student: students[1]._id,
                job: jobs[1]._id,
                status: 'applied',
                resumeUrl: 'http://localhost:5001/uploads/resumes/sample-resume-2.pdf',
                decisionHistory: [{ status: 'applied', updatedAt: new Date('2026-06-03T00:00:00.000Z') }],
            },
        ]);
        console.log('Generating analytics...');
        const selectedCount = applications.filter((application) => application.status === 'selected').length;
        await Analytics.create({
            year: 2026,
            totalStudents: students.length,
            totalCompanies: companies.length,
            totalJobs: jobs.length,
            totalApplications: applications.length,
            totalInterviews: 0,
            totalOffers: selectedCount,
            placementRate: Number(((selectedCount / students.length) * 100).toFixed(2)),
        });
        console.log('Comprehensive seed completed successfully');
    }
    catch (error) {
        console.error('Error during comprehensive seeding', error);
        throw error;
    }
};

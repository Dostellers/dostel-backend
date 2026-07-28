# Dostel Project - Agentic Developer Coordination Mechanism

This document outlines how multiple agentic developers will coordinate their work on the Dostel project to ensure efficient collaboration and high-quality output.

## 1. Communication Protocols

### Daily Standup (Async)
- Each agent posts a daily update in their respective AGENTS.md file by 10:00 AM UTC
- Updates should include:
  - What was accomplished yesterday
  - What is being worked on today
  - Any blockers or dependencies
  - Estimated completion time for current tasks

### Issue Tracking
- All work must be tracked through issues in the project management system
- Issues should follow the format: `[SKILL_SET]-[NUMBER]: Brief Description`
- Examples: `[BACKEND]-101: Implement user authentication`, `[FRONTEND]-205: Create hostel listing page`

### Code Review Process
1. Developer completes task and creates pull request
2. Assigns at least one reviewer with relevant expertise
3. Reviewer checks:
   - Code follows project conventions
   - Tests are adequate and passing
   - Documentation is updated if needed
   - No security vulnerabilities introduced
4. Once approved, PR can be merged

## 2. Task Management System

### Task States
- `TO_DO`: Task is ready to be worked on
- `IN_PROGRESS`: Agent is actively working on the task
- `REVIEW`: Code is submitted for review
- `DONE`: Task is completed and merged
- `BLOCKED`: Task cannot proceed due to dependencies

### Task Assignment
- Tasks are assigned based on agent specializations
- Load balancing considerations to prevent overload
- Priority levels: `P0` (critical), `P1` (high), `P2` (medium), `P3` (low)
- Tasks should be estimable in hours or days

## 3. Development Workflow

### Feature Development Process
1. **Analysis**: Agent reviews requirements and creates technical plan
2. **Implementation**: Developer writes code following project standards
3. **Testing**: Developer writes and runs tests locally
4. **Review**: Code submitted for peer review
5. **Testing**: QA performs additional testing if needed
6. **Deployment**: Code deployed to staging for verification
7. **Release**: Code promoted to production

### Branching Strategy
- `main`: Production-ready code
- `develop`: Integration branch for completed features
- `feature/*`: Feature branches branching from `develop`
- `bugfix/*`: Bug fixes branching from `develop`
- `release/*`: Release preparation branches
- `hotfix/*`: Emergency fixes branching from `main`

## 4. Quality Gates

### Code Quality
- ESLint and Prettier must pass
- No console.log statements in production code
- Proper error handling implemented
- Meaningful variable and function names
- Appropriate commenting for complex logic

### Testing Standards
- Unit tests for all utility functions and components
- Integration tests for API endpoints
- End-to-end tests for critical user flows
- Minimum 80% code coverage for new code

### Performance Standards
- Page load times under 3 seconds on 3G
- API response times under 200ms for 95% of requests
- Memory leaks checked and fixed
- Bundle size optimization for frontend

## 5. Conflict Resolution

### Merge Conflicts
- Developers responsible for resolving their own merge conflicts
- Use graphical merge tools when available
- Communicate with team members whose code is being modified
- Test thoroughly after resolving conflicts

### Priority Conflicts
- Product Owner has final say on priority disputes
- Technical blockers escalated to Tech Lead
- Dependency conflicts resolved through negotiation

## 6. Knowledge Sharing

### Documentation Requirements
- All public APIs must be documented
- Complex algorithms require explanatory comments
- Architecture decisions recorded in ADR (Architecture Decision Records)
- Setup and deployment instructions kept up to date

### Learning Sessions
- Weekly knowledge sharing sessions (30 minutes)
- Each agent presents on their area of expertise
- Recordings stored in shared knowledge base
- New team members required to review relevant sessions

## 7. Metrics and Monitoring

### Productivity Metrics
- Story points completed per sprint
- Cycle time (work start to completion)
- Code review turnaround time
- Bug escape rate (bugs found in production)

### Quality Metrics
- Test coverage percentage
- Critical/security bugs found in production
- Customer-reported issues
- Performance benchmark results

## 8. Escalation Procedures

### Blocked Tasks
1. Attempt to resolve independently (30 minutes)
2. Consult relevant team member (15 minutes)
3. Escalate to Tech Lead if still blocked
4. Document blocker and workaround in AGENTS.md

### Technical Disagreements
1. Present evidence-based arguments
2. Seek compromise solution
3. Escalate to Tech Lead for decision if needed
4. Disagree and commit once decision is made

## 9. Working Hours and Availability

### Core Collaboration Hours
- 14:00-18:00 UTC (4-hour overlap for all time zones)
- Urgent issues can be addressed outside these hours
- Regular updates expected during working hours

### Time Off and Availability
- Planned time off should be scheduled in advance
- Emergency absences should be communicated immediately
- Long-term absences require knowledge transfer

## 10. Tools and Infrastructure

### Communication
- Primary: Project management system issue comments
- Secondary: Team chat for quick questions
- Tertiary: Email for formal communications

### Development
- Shared development environment standards
- Standardized IDE configurations where possible
- Shared code snippets and templates
- Common debugging tools and techniques

### Version Control
- Git flow branching model
- Squash and merge for feature branches
- Signed commits for security
- Protected branches requiring reviews

## Implementation Timeline

### Week 1: Setup and Onboarding
- All agents review this document and project README
- Setup development environments
- Complete initial knowledge transfer sessions
- Identify initial set of tasks

### Week 2: Initial Sprint
- Begin working on assigned tasks
- Establish daily standup rhythm
- Begin code review processes
- Identify and resolve integration issues

### Week 3+: Ongoing Development
- Continue with sprint cycles
- Refine processes based on retrospectives
- Scale team up or down as needed
- Continuous improvement of coordination mechanisms

## Success Metrics

### Team Metrics
- Sprint predictability (planned vs completed)
- Average cycle time
- Code review participation rate
- Knowledge sharing session attendance

### Product Metrics
- Feature adoption rate
- User satisfaction scores
- System performance benchmarks
- Production incident rate

### Quality Metrics
- Defect escape rate
- Test coverage trends
- Security vulnerability count
- Technical debt ratio

This coordination mechanism should be reviewed and updated monthly based on team feedback and project evolution.
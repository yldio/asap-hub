module.exports.description = 'remove keyword validation';

module.exports.up = (migration) => {
  const projects = migration.editContentType('projects');
  projects.editField('keywords').items({
    type: 'Symbol',
    validations: [
      {
        size: {
          max: 6,
        },
      },
    ],
  });
  projects.changeFieldControl('keywords', 'builtin', 'tagEditor', {});
};

module.exports.down = (migration) => {
  const projects = migration.editContentType('projects');
  projects.editField('keywords').items({
    type: 'Symbol',
    validations: [
      {
        in: [
          'Administrative Support',
          'Bash',
          'Biobanking',
          'Biostatistics',
          'Career Development',
          'Communications',
          'Computer Science',
          'Course Management',
          'Data Science',
          'Diversity',
          'Education',
          'Epidemiology',
          'Genetics',
          'Genomics',
          'GP2 Opportunities',
          'GP2 PhD',
          'Laboratory Science',
          'Machine Learning',
          'Molecular Biology',
          'Movement Disorders',
          'Neurodegeneration',
          'Neurogenetics',
          'Neuroimaging',
          'Neurology',
          'Operations',
          'Outreach',
          "Parkinson's disease",
          'Patient Advocate',
          'Patient Engagement',
          'Pharmacogenomics',
          'Program Management',
          'Project Management',
          'Python',
          'R',
          'Research Communications',
          'Research Grants',
          'Stata',
          'Training',
          "GP2 Master's",
        ],
      },
    ],
  });
  projects.changeFieldControl('keywords', 'builtin', 'checkbox', {});
};

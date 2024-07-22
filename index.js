#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs-extra');

const program = new Command();

program
  .command('create')
  .description('创建新项目')
  .action(async function loop() {
    const projectKey = '请输入项目名称'
    const projectNameInput = await inquirer.prompt({ type: 'projectName', name: projectKey });
    const projectName = projectNameInput[projectKey]
    const templateChoices = [
      { name: 'Vue2 组件库', value: 'plex-ui-vue2' },
      { name: 'Vue3 组件库', value: 'plex-ui-vue3' },
    ];

    if (!projectName) {
      await loop()
      return
    }

    const { selectedTemplate } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedTemplate',
        message: '请选择项目模板:',
        choices: templateChoices,
      },
    ]);
    createProject(projectName, selectedTemplate);
  });

program.version('1.0.1');

program.parse();

async function createProject(projectName, selectedTemplate) {
  const templatePath = `${__dirname}/templates/${selectedTemplate}`;
  const projectPath = `${process.cwd()}/${projectName}`;

  await fs.ensureDir(projectPath);

  await fs.copy(templatePath, projectPath, { overwrite: true });

  console.log(`项目 ${projectName} 创建成功！`);

  const packageJsonPath = `${projectPath}/package.json`;
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath));
  packageJson.name = projectName;

  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log(`1. 运行 cd ${projectName} 进入项目目录`);
  console.log(`2. 运行 npm install 安装依赖`);
  console.log(`3. 运行 npm run dev 启动项目`);
}

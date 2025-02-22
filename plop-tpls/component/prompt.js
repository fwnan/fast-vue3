/*
 * @GitHub: https://github.com/MaleWeb/fast-vue3
 * @version: 
 * @Author: 扫地盲僧
 * @Date: 2022-01-21 16:58:34
 * @LastEditors: BlindMonk
 * @LastEditTime: 2022-01-21 17:00:25
 */
const fs = require('fs')

function getFolder(path) {
    let components = []
    const files = fs.readdirSync(path)
    files.forEach(function(item) {
        let stat = fs.lstatSync(path + '/' + item)
        if (stat.isDirectory() === true && item != 'components') {
            components.push(path + '/' + item)
            components.push.apply(components, getFolder(path + '/' + item))
        }
    })
    return components
}

module.exports = {
    description: '创建组件',
    prompts: [
        {
            type: 'confirm',
            name: 'isGlobal',
            message: '是否为全局组件',
            default: false
        },
        {
            type: 'list',
            name: 'path',
            message: '请选择组件创建目录',
            choices: getFolder('src/pages'),
            when: answers => {
                return !answers.isGlobal
            }
        },
        {
            type: 'input',
            name: 'name',
            message: '请输入组件名称',
            validate: v => {
                if (!v || v.trim === '') {
                    return '组件名称不能为空'
                } else {
                    return true
                }
            }
        }
    ],
    actions: data => {
        let path = ''
        if (data.isGlobal) {
            path = 'src/components/{{properCase name}}/index.vue'
        } else {
            path = `${data.path}/components/{{properCase name}}/index.vue`
        }
        const actions = [
            {
                type: 'add',
                path: path,
                templateFile: 'plop-templates/component/index.hbs'
            }
        ]
        return actions
    }
}

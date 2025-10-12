const { log } = require('console');
const crypto = require('crypto');
/**
 * 使用 SHA-256 挖矿，寻找满足指定前缀和零开头数量的哈希值
 * @param {string} prefix - 哈希前缀字符串
 * @param {number} targetZero - 零开头数量
 * @return {object} - 返回包含 nonce 和对应哈希值的对象
 */
function mint(prefix, targetZero) {

    const target = "0".repeat(targetZero);
    let nonce = 0;
    const startTime = Date.now();

    while (true) {
        const content = prefix + nonce
        const hash = crypto.createHash('sha256').update(content).digest('hex');

        // 满足条件时跳出循环
        if (hash.startsWith(target)) {
            const endTime = Date.now()
            return {
                time: (endTime - startTime) / 1000,
                hash,
                content,
                nonce,
            }
        }

        nonce++;
    }
}

function logResult(powResult, targetZero) {
    console.log(`\n满足哈希值为${targetZero}个0开头的运行结果:`);
    console.log(`花费时间: ${powResult.time.toFixed(2)} 秒`);
    console.log(`Nonce值: ${powResult.nonce}`);
    console.log(`哈希内容: ${powResult.content}`);
    console.log(`哈希值: ${powResult.hash}`);
}

const powResult1 = mint('果糖酱', 4);
logResult(powResult1, 4);

const powResult2 = mint('果糖酱', 5);
logResult(powResult2, 5);